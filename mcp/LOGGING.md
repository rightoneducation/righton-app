# MCP Logging System

All three MCP services now output structured JSON logs to make it easy to see what's happening.

## Log Files Location

Logs are written to the `logs/` directory in each service:

- **MCP Server** (student/game data): `mcp/server/logs/mcp-server.json`
- **Ext-MCP Server** (learning science data): `mcp/ext-mcp/logs/ext-mcp-server.json`
- **MCP Host** (orchestrator): `mcp/host/logs/mcp-host.json`

## Log Entry Format

Each log entry has this structure:

```json
{
  "timestamp": "2024-10-16T10:30:45.123Z",
  "level": "info",
  "service": "mcp-host",
  "type": "query_received",
  "data": {
    "query": "Which students are struggling?"
  }
}
```

### Fields

- `timestamp`: ISO 8601 timestamp
- `level`: `info`, `error`, or `debug`
- `service`: Which service logged this (`mcp-server`, `ext-mcp-server`, or `mcp-host`)
- `type`: Event type (see below)
- `data`: Event-specific data

## Event Types

### MCP Host (`mcp-host.json`)

| Type | Level | Description | Data |
|------|-------|-------------|------|
| `initializing_mcp_clients` | info | Starting to connect to MCP servers | `clients`: array of server configs |
| `mcp_connection_start` | info | Beginning connection attempts | `serverCount`: number of servers |
| `mcp_connected` | info | Successfully connected to a server | `name`, `url`, `toolCount`, `tools` |
| `mcp_connection_failed` | error | Failed to connect to a server | `name`, `url`, `error` |
| `mcp_clients_initialized` | info | All connections complete | - |
| `server_started` | info | HTTP server started | `port` |
| `query_received` | info | User query received | `query` |
| `llm_request_start` | info | Sending request to LLM | `query`, `availableTools` |
| `llm_tool_calls_requested` | info | LLM requested tool calls | `iteration`, `toolCalls` |
| `tool_call_start` | info | Starting a tool call | `toolName`, `args` |
| `tool_call_complete` | info | Tool call finished | `toolName`, `args`, `resultLength`, `result` |
| `llm_request_with_tool_results` | info | Sending tool results back to LLM | `iteration` |
| `llm_final_response` | info | LLM's final response | `totalIterations`, `finalResponse` |
| `query_completed` | info | Query fully processed | `query`, `resultLength` |
| `query_error` | error | Error processing query | `query`, `error`, `stack` |
| `invalid_request` | error | Bad request received | `error` |

### MCP Server (`mcp-server.json`)

| Type | Level | Description | Data |
|------|-------|-------------|------|
| `server_started` | info | Server listening | `port` |
| `request_received` | info | MCP request received | `sessionId`, `method`, `hasParams` |
| `session_initialized` | info | New session created | `sessionId` |
| `session_closed` | info | Session terminated | `sessionId` |
| `tool_called` | info | Tool invoked | `tool`, input params |
| `tool_result` | info | Tool completed | `tool`, result summary |
| `request_error` | error | Request failed | `sessionId`, `error`, `stack` |
| `server_start_failed` | error | Server failed to start | `error` |

### Ext-MCP Server (`ext-mcp-server.json`)

Same event types as MCP Server, but for the learning science data server.

## Example: Tracing a Query

To understand what happened with a query, read the logs in order:

### 1. Host receives query
```json
{
  "timestamp": "2024-10-16T10:30:45.000Z",
  "level": "info",
  "service": "mcp-host",
  "type": "query_received",
  "data": { "query": "Which students are struggling with 6.NS.B.3?" }
}
```

### 2. Host sends to LLM
```json
{
  "type": "llm_request_start",
  "data": {
    "query": "Which students are struggling with 6.NS.B.3?",
    "availableTools": ["getGameSessionsByClassroomId", "getStudentHistory", "getLearningScienceDatabyCCSS"]
  }
}
```

### 3. LLM requests tool calls
```json
{
  "type": "llm_tool_calls_requested",
  "data": {
    "iteration": 1,
    "toolCalls": [
      { "name": "getGameSessionsByClassroomId", "args": "{\"classroomId\":\"class123\"}" },
      { "name": "getLearningScienceDatabyCCSS", "args": "{\"ccss\":\"6.NS.B.3\"}" }
    ]
  }
}
```

### 4. Each tool executes
In `mcp-server.json`:
```json
{
  "type": "tool_called",
  "data": { "tool": "getGameSessionsByClassroomId", "classroomId": "class123" }
}
```

In `ext-mcp-server.json`:
```json
{
  "type": "tool_called",
  "data": { "tool": "getLearningScienceDatabyCCSS", "ccss": "6.NS.B.3" }
}
```

### 5. Host logs results
```json
{
  "type": "tool_call_complete",
  "data": {
    "toolName": "getGameSessionsByClassroomId",
    "resultLength": 5432,
    "result": { /* full result data */ }
  }
}
```

### 6. Final response
```json
{
  "type": "llm_final_response",
  "data": {
    "totalIterations": 1,
    "finalResponse": "Based on the game sessions and learning science data, students Alice and Bob are struggling..."
  }
}
```

## Log Rotation

Logs automatically keep only the last 1000 entries per file to prevent unbounded growth. Older entries are removed as new ones are added.

## Viewing Logs

### Pretty print
```bash
cat mcp/host/logs/mcp-host.json | jq '.'
```

### Filter by type
```bash
cat mcp/host/logs/mcp-host.json | jq '.[] | select(.type == "tool_call_complete")'
```

### Filter by level
```bash
cat mcp/host/logs/mcp-host.json | jq '.[] | select(.level == "error")'
```

### Get last 10 entries
```bash
cat mcp/host/logs/mcp-host.json | jq '.[-10:]'
```

### Search for specific query
```bash
cat mcp/host/logs/mcp-host.json | jq '.[] | select(.data.query | contains("struggling"))'
```

