import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

export class MCPClientClass {
  private mcp: Client;
  private transport: StreamableHTTPClientTransport;
  private tools: any[] = [];

  constructor(url: string){
    this.transport = new StreamableHTTPClientTransport(new URL(url));
    this.mcp = new Client({ name: "mcp", version: "1.0.0" });
  }

  async connect(){
    try { 
      await this.mcp.connect(this.transport);
      const toolsResult = await this.mcp.listTools();
      this.tools = toolsResult.tools.map((tool) => {
        return {
          type: 'function',
          function: {
            name: tool.name,
            description: tool.description,
            parameters: tool.inputSchema,
          }
        };
      });
    } catch (error) {
      console.error('Failed to connect to MCP:', error);
      throw error;
    }
  }

  async callTool(name: string, args: any){
    const result = await this.mcp.callTool({
      name,
      arguments: args
    });
    return result;
  }

  getTools() {
    return this.tools;
  }

  async disconnect() {
    await this.mcp.close();
  }
}