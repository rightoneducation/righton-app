import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";
import { OpenAI } from "openai";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions.mjs";

export class MCPClient {
  private mcp: Client;
  private transport: StreamableHTTPClientTransport;
  private tools: any[] = [];

  constructor(url: string){
    this.transport = new StreamableHTTPClientTransport(new URL(url));
    this.mcp = new Client({ name: "mcp", version: "1.0.0", transport: this.transport });
  }

  async connect(){
    try { 
      await this.mcp.connect(this.transport);
      const toolsResult = await this.mcp.listTools();
      this.tools = toolsResult.tools.map((tool) => {
        return {
          name: tool.name,
          description: tool.description,
          input_schema: tool.inputSchema,
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

  // async processQuery(query: string) {
  //   const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    
  //   const messages: ChatCompletionMessageParam[] = [
  //     { role: "user", content: query }
  //   ];
  
  //   let response = await openai.chat.completions.create({
  //     model: "gpt-4o",
  //     messages: messages,
  //     tools: this.tools,
  //   });
  
  //   const finalText = [];
  
  //   // Keep looping while OpenAI wants to use tools
  //   while (response.choices[0].message.tool_calls) {
  //     const message = response.choices[0].message;
      
  //     // Add assistant's message (with tool calls) to history
  //     messages.push(message);
  
  //     // Process ALL tool calls before making next API call
  //     for (const call of message.tool_calls || []) {
  //       const toolName = call.function.name;
  //       const toolArgs = JSON.parse(call.function.arguments || "{}");
  
  //       const result = await this.mcp.callTool({
  //         name: toolName,
  //         arguments: toolArgs,
  //       });
  
  //       finalText.push(
  //         `[Calling tool ${toolName} with args ${JSON.stringify(toolArgs)}]`
  //       );
  
  //       // Add tool result
  //       messages.push({
  //         role: "tool",
  //         tool_call_id: call.id,
  //         content: JSON.stringify(result.content),
  //       });
  //     }
  
  //     // ONE API call after processing all tools
  //     response = await openai.chat.completions.create({
  //       model: "gpt-4o",
  //       messages: messages,
  //       tools: this.tools,
  //     });
  //   }
  
  //   // Extract final text (finish_reason is "stop" now)
  //   const finalMessage = response.choices[0].message.content;
  //   if (finalMessage) {
  //     finalText.push(finalMessage);
  //   }
  
  //   return finalText.join("\n");
  // }

  getTools() {
    return this.tools;
  }

  async disconnect() {
    await this.mcp.close();
  }
}