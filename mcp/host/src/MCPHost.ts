import express from 'express';
import cors from 'cors';
import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";
import { MCPClient } from '../../client/MCPClient.ts'

// express server for MCPHost

export async function initializeMCP(servers: Array<{name: string, version: string, url: string}>) {
  console.log('Initializing MCP connections...');

  for (const {name, url} of servers){
    const client = new MCPClient(url);
    await client.connect();
  }
}
