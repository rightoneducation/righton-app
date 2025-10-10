# MCP - Server:
A `node.js/express` MCP server deployed via Docker and hosted on an EC2 instance. MCP server architecture is developed via `@modelcontextprotocol`. Transport is provided via `StreamableHTTPServerTransport`

Works in tandem with `host` and `client` to provide LLMs access to RightOn game/user data. 

## File Breakdown:
- `index.ts` - express server with GET/POST/DELETE handling. Per `@modelcontextprotocol` server uses JSON-RPC, so majority of calls are via POST.
- `mcp.ts` - MCP server defintion via `@modelcontextprotocol.` Registers tools and resources. 
- `./functions/HelperFunctions.ts` - contains graphQL operations used in `mcp.ts` tools.
- `./resources` - contains resources registered to MCP in `mcp.ts`.

## MCP Tools: 
- `getGameSessionsByClassroomId` - fetches all game sessions (in a specified time window) for a given classroom
- `getStudentHistory` - fetches student data over time. Data is anonimized prior to being stored on the backend in accordance with privacy and security requirements. 

## MCP Resources:
- `CCSSDictionary` - structured JSON of CCSS data for math students
- `referenceSchema` - schema data for GameSesssion and Team GraphQL structures on the RightOn backend. 