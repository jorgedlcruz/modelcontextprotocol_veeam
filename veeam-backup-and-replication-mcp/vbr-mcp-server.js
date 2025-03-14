// vbr-mcp-server.js
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get the directory path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create an MCP server
const server = new McpServer({
  name: "VBR API Server",
  version: "1.0.0"
});

// Define the tools directory path
const toolsDir = path.join(__dirname, "tools");

// Dynamically load all tools
async function loadTools() {
  try {
    // Check if tools directory exists
    if (!fs.existsSync(toolsDir)) {
      fs.mkdirSync(toolsDir, { recursive: true });
    }

    // Read tool files from the directory
    const files = fs.readdirSync(toolsDir);
    
    // Import and register each tool
    for (const file of files) {
      if (file.endsWith('.js')) {
        try {
          const toolPath = path.join(toolsDir, file);
          const toolModule = await import(`file://${toolPath}`);
          
          if (toolModule.default && typeof toolModule.default === 'function') {
            toolModule.default(server);
          }
        } catch (err) {
          // Use process.stderr for errors
          process.stderr.write(`Error loading tool ${file}: ${err.message}\n`);
        }
      }
    }
  } catch (error) {
    process.stderr.write(`Error loading tools: ${error.message}\n`);
  }
}

// Load all tools before starting the server
await loadTools();

// Start receiving messages on stdin and sending messages on stdout
const transport = new StdioServerTransport();
await server.connect(transport);