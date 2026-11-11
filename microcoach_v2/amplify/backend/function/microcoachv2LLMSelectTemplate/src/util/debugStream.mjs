/**
 * Diagnostic for a call that doesn't return (input.debugStream === true only; normal
 * runs and uploads never reach this file). A non-streaming call shows nothing until it
 * finishes, so a stall and a runaway look alike. This streams the call, logs what
 * arrives, and returns the same completion shape as a normal call.
 *
 * The logs hold the generated text, so debugStream is for fixture eval runs only.
 */
import { createHash } from 'node:crypto';

const CONTAINER_START = Date.now();
let invocationCount = 0;

const HEARTBEAT_MS = 30_000;
const SILENT_AFTER_OUTPUT_MS = 60_000;
const SILENT_WITH_NO_OUTPUT_MS = 150_000;
// The Lambda dies at 300 s with no chance to log, so keep the last text before that.
const LAST_DUMP_AT_MS = 265_000;
const FIRST_DUMP_AT_CHARS = 12_000;
const WHITESPACE_RUN = /(?:\s|\\[nrt]){200,}/;

const sha = (text) => createHash('sha256').update(text).digest('hex').slice(0, 16);
const secs = (ms) => `${Math.round(ms / 1000)}s`;
const socketState = (s) => `destroyed ${s.destroyed} · state ${s.readyState} · bytes read ${s.bytesRead} · bytes written ${s.bytesWritten} · remote ${s.remoteAddress ?? '?'} · timeout ${s.timeout ?? '?'}`;

function contentStats(content) {
  const tail = content.slice(-500);
  const keys = [...content.matchAll(/"([A-Za-z_]+)"\s*:/g)];
  const counts = {};
  for (const k of keys) counts[k[1]] = (counts[k[1]] ?? 0) + 1;
  const top = Object.entries(counts).sort((x, y) => y[1] - x[1]).slice(0, 10).map(([k, n]) => `${k}:${n}`).join(' ');
  const lastKey = keys[keys.length - 1];
  const probe = content.slice(-60);
  return `tail whitespace ${tail.length ? Math.round(((tail.match(/\s/g)?.length ?? 0) * 100) / tail.length) : 0}% · last 60 chars seen ${probe ? content.split(probe).length - 1 : 0}x · last key ${lastKey?.[1] ?? 'none'} · chars since it ${lastKey ? content.length - lastKey.index : content.length} · keys ${keys.length} [${top}]`;
}

export async function streamedCompletion(openai, params, { tag, retries = 0 }) {
  invocationCount += 1;
  const t0 = Date.now();
  const log = (what) => console.log(`${tag} ${what}`);
  const dump = (name, text) => {
    const PART = 100_000;
    const parts = Math.max(1, Math.ceil(text.length / PART));
    for (let i = 0; i < parts; i += 1) {
      log(`${name} part ${i + 1}/${parts} (${text.length} chars) ${JSON.stringify(text.slice(i * PART, (i + 1) * PART))}`);
    }
  };
  const state = {
    headersAt: null, chunks: 0, content: '', lastChunkAt: null, maxGapMs: 0, beatChars: 0, beatAt: t0,
    nextDumpAt: FIRST_DUMP_AT_CHARS, lastDump: false, probed: false, socket: null,
  };

  const outcome = (finishReason, how) => {
    const { content } = state;
    const run = WHITESPACE_RUN.exec(content);
    let whitespace = null;
    if (run) {
      const before = content.slice(0, run.index);
      whitespace = {
        at: run.index,
        length: content.slice(run.index).match(/^(?:\s|\\[nrt])*/)[0].length,
        lastKey: [...before.matchAll(/"([A-Za-z_]+)"\s*:/g)].pop()?.[1] ?? null,
        insideString: (before.replace(/\\./g, '').match(/"/g) ?? []).length % 2 === 1,
        before: before.slice(-300),
      };
    }
    const silentFor = Date.now() - (state.lastChunkAt ?? t0);
    let type = 'normal';
    if (finishReason === 'length') type = 'capped';
    else if (finishReason !== 'stop' && silentFor >= SILENT_AFTER_OUTPUT_MS) type = 'stall';
    else if (finishReason !== 'stop') type = 'runaway';
    else if ((whitespace?.length ?? 0) >= 2_000) type = 'whitespace-ended-itself';
    log(`outcome ${JSON.stringify({
      how, type, seconds: Math.round((Date.now() - t0) / 1000), finish: finishReason, chunks: state.chunks, chars: content.length, silentSeconds: Math.round(silentFor / 1000), whitespace,
    })}`);
  };

  // When the call goes silent: is the socket alive, is data still arriving, and can
  // this same container still reach OpenAI? It never touches the call itself.
  const stallProbe = async () => {
    const { getDefaultAgent } = await import('openai/_shims/index.mjs');
    const sockets = Object.values(getDefaultAgent(openai.baseURL).sockets ?? {}).flat();
    log(`stall probe · silent · sockets in use ${sockets.length} · ${sockets.map(socketState).join(' | ') || 'none'}`);
    [state.socket] = sockets;
    const before = state.socket?.bytesRead;
    await new Promise((resolve) => { setTimeout(resolve, 20_000); });
    log(`stall probe · bytes read over the next 20 s: ${state.socket ? state.socket.bytesRead - before : 'no socket'} · chunks ${state.chunks}`);
    const timed = async (name, run) => {
      const t = Date.now();
      try {
        await run();
        log(`stall probe · ${name} ok in ${Date.now() - t} ms`);
      } catch (err) {
        log(`stall probe · ${name} failed after ${Date.now() - t} ms · ${err?.message ?? err}`);
      }
    };
    await timed('GET /v1/models', () => openai.models.list({ timeout: 20_000, maxRetries: 0 }));
    await timed('small chat, first chunk', async () => {
      const probe = await openai.chat.completions.create({
        model: params.model, stream: true, max_completion_tokens: 200, messages: [{ role: 'user', content: 'Reply with the word ok.' }],
      }, { timeout: 45_000, maxRetries: 0 });
      for await (const chunk of probe) if (chunk) break;
    });
    log(`stall probe · finished · chunks ${state.chunks}`);
  };

  log(`start · model ${params.model} · prompt ${params.messages.reduce((n, m) => n + String(m.content ?? '').length, 0)} chars · invocation ${invocationCount} in this container · container age ${secs(t0 - CONTAINER_START)} · prompt sha256 ${sha(JSON.stringify(params.messages))} · schema sha256 ${sha(JSON.stringify(params.response_format))}`);

  const heartbeat = setInterval(() => {
    const now = Date.now();
    const { content } = state;
    log(`still waiting after ${secs(now - t0)} · headers ${state.headersAt ? 'yes' : 'no'} · chunks ${state.chunks} · content ${content.length} chars · last chunk ${state.lastChunkAt ? `${secs(now - state.lastChunkAt)} ago` : 'never'} · ${Math.round(((content.length - state.beatChars) * 1000) / Math.max(1, now - state.beatAt))} chars/s · largest gap ${state.maxGapMs} ms · ${contentStats(content)}`);
    log(`tail ${JSON.stringify(content.slice(-500))}`);
    state.beatChars = content.length;
    state.beatAt = now;
    if (state.socket) log(`socket · ${socketState(state.socket)}`);
    if (content.length >= state.nextDumpAt) {
      dump('content so far', content);
      state.nextDumpAt = content.length * 2;
    }
    const silentFor = state.lastChunkAt ? now - state.lastChunkAt : now - t0;
    if (!state.probed && silentFor >= (state.lastChunkAt ? SILENT_AFTER_OUTPUT_MS : SILENT_WITH_NO_OUTPUT_MS)) {
      state.probed = true;
      stallProbe().catch((err) => log(`stall probe error · ${err?.message ?? err}`));
    }
    if (now - t0 >= LAST_DUMP_AT_MS && !state.lastDump) {
      state.lastDump = true;
      dump('content near the Lambda limit', content);
      outcome(null, 'near-lambda-limit');
    }
  }, HEARTBEAT_MS);

  try {
    const { data: stream, response } = await openai.chat.completions
      .create({ ...params, stream: true, stream_options: { include_usage: true } }, { maxRetries: retries })
      .withResponse();
    state.headersAt = Date.now();
    const headers = {};
    response.headers.forEach((value, key) => { if (key !== 'set-cookie') headers[key] = value; });
    log(`headers in ${secs(state.headersAt - t0)} · status ${response.status} · request ${response.headers.get('x-request-id') ?? '?'} · ${JSON.stringify(headers)}`);
    let finishReason = null;
    let usage = null;
    for await (const chunk of stream) {
      const now = Date.now();
      if (state.chunks === 0) log(`first chunk in ${secs(now - t0)} · ${JSON.stringify(chunk)}`);
      if (state.lastChunkAt) state.maxGapMs = Math.max(state.maxGapMs, now - state.lastChunkAt);
      state.chunks += 1;
      state.lastChunkAt = now;
      const choice = chunk.choices?.[0];
      if (choice?.delta?.content) state.content += choice.delta.content;
      if (choice?.finish_reason) finishReason = choice.finish_reason;
      if (chunk.usage) usage = chunk.usage;
    }
    log(`stream closed after ${secs(Date.now() - t0)} · finish ${finishReason ?? 'none'} · chunks ${state.chunks} · largest gap ${state.maxGapMs} ms · usage ${JSON.stringify(usage)}`);
    log(`final · ${contentStats(state.content)}`);
    let parse = 'valid JSON';
    try { JSON.parse(state.content); } catch (err) { parse = `invalid JSON: ${err.message}`; }
    log(`final text is ${parse}`);
    dump('final content', state.content);
    outcome(finishReason, 'closed');
    return { choices: [{ message: { content: state.content }, finish_reason: finishReason }], usage };
  } catch (err) {
    log(`failed after ${secs(Date.now() - t0)} · ${err?.message ?? err}`);
    throw err;
  } finally {
    clearInterval(heartbeat);
  }
}
