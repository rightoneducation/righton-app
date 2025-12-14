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
    console.log('[MCPClientClass] callTool called', {
      timestamp: new Date().toISOString(),
      toolName: name,
      args: JSON.stringify(args),
      argsKeys: Object.keys(args || {})
    });
    
    try {
      const result = await this.mcp.callTool({
        name,
        arguments: args
      });
      
      console.log('[MCPClientClass] callTool result received', {
        timestamp: new Date().toISOString(),
        toolName: name,
        resultType: typeof result,
        hasContent: !!result?.content,
        contentLength: Array.isArray(result?.content) ? result.content.length : 0,
        resultPreview: result ? JSON.stringify(result).substring(0, 500) : 'null'
      });
      
      return result;
    } catch (error) {
      console.error('[MCPClientClass] callTool error', {
        timestamp: new Date().toISOString(),
        toolName: name,
        args: JSON.stringify(args),
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
      throw error;
    }
  }

  getTools() {
    return this.tools;
  }

  async disconnect() {
    await this.mcp.close();
  }
}