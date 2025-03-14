# Veeam Backup & Replication MCP Server

<p align="center">
  <img src="assets/vbr-mcp-logo.png" alt="VBR MCP Server Logo" width="200" height="200" />
</p>

<p align="center">
  <strong>AI-powered Veeam Backup & Replication management through Model Context Protocol</strong>
</p>

<p align="center">
  <a href="#features">Features</a> |
  <a href="#installation">Installation</a> |
  <a href="#usage">Usage</a> |
  <a href="#tools">Available Tools</a> |
  <a href="#development">Development</a>
</p>

The Veeam Backup & Replication MCP Server enables AI assistants to interact with Veeam Backup & Replication through the Model Context Protocol. Monitor backup jobs, check repository status, analyze license usage, and manage your backup infrastructure, all through natural language interactions with compatible AI systems.

## Features

- 🔐 Secure authentication with Veeam Backup & Replication REST API
- 📊 Access detailed information about your backup environment
- 📝 Monitor backup sessions and job status
- 💾 Check repository capacity and health
- 📈 Analyze license usage and compliance
- 🧩 Extensible architecture with dynamically loaded tools
- 🤖 Seamless integration with AI assistants supporting MCP

## Installation

```bash
# Clone the repository
git clone https://github.com/jorgedlcruz/modelcontextprotocol_veeam/veeam-backup-and-replication-mcp.git
cd vbr-mcp-server

# Install dependencies
npm install

# Optional, but recommended to add your credentials to the /tools/auth-tool.js. If not you will need to use the next every time you use it. which is not ideal to pass user/pass plain in the AI context
@tool auth-vbr {"host":"YOURHOST","username":".\\YOURUSER","password":"YOURPASS"}
```

## Usage

Start the server just to check all is good:

```bash
node vbr-mcp-server.js
```

Connect to the server using any MCP-compatible client or AI assistant. The server operates via stdin/stdout using the Model Context Protocol.

### Quick Start

1. Authenticate with your VBR server. There are two ways, if you have specified the credentials on the /tools/auth-tool.js then just:

```
auth-vbr
```

If you want to use different server/user/pass any time you want to interact through Veeam MCP, then you can do this in the chat:

```
auth-vbr({
  "host": "your-vbr-server",
  "username": "domain\\user",
  "password": "your-password"
})
```

The response should be something like:

```
{}
Authentication successful. Connected to 192.168.1.41. Token received and stored for subsequent API calls.
```

2. Check your repositories:

```
get-repositories()
```

3. View recent backup sessions:

```
get-backup-sessions({ "limit": 10 })
```

## Tools

VBR MCP Server provides a suite of tools for interacting with Veeam Backup & Replication:

| Tool | Description | Parameters |
|------|-------------|------------|
| `auth-vbr` | Authenticate with VBR server | `host`, `username`, `password` |
| `get-repositories` | List backup repositories | `limit`, `skip`, `threshold` |
| `get-proxies` | List backup proxies | `limit`, `skip` |
| `get-backup-sessions` | List backup sessions | `limit`, `skip` |
| `get-license-info` | Get license information | - |
| `get-license-workloads` | Get licensed workloads | - |
| `get-server-info` | Get VBR server information | - |

## Development

### Project Structure

```
vbr-mcp-server/
├── vbr-mcp-server.js                   # Main server file
├── tools/                              # Tool implementations
│   ├── auth-tool.js                    # Authentication tool
│   ├── backup-proxies-tool.js          # Proxies tool
│   ├── backup-proxies-tool.js          # Proxies tool
│   ├── backup-repositories-tool.js     # Repositories tool
│   ├── backup-sessions-tool.js         # Backup Sessions tool
│   ├── server-info-tool.js             # Get some good server information tool
├── package.json
├── .env                                # Environment configuration (not in git)
└── README.md
```

### Creating Custom Tools

I totally enocurage you to explore the rich Veeam Backup & Replication API, and add new capabilities by creating JavaScript files in the `tools` directory:

```javascript
// tools/example-tool.js
import fetch from "node-fetch";
import { z } from "zod";

export default function(server) {
  server.tool(
    "example-tool-name",
    {
      param1: z.string().describe("Parameter description"),
      param2: z.number().optional().describe("Optional parameter")
    },
    async (params) => {
      // Implementation
      return {
        content: [{ type: "text", text: "Tool response" }]
      };
    }
  );
}
```
## Security

- ⚠️ Never commit credentials to Git
- 🔒 Use environment variables for sensitive information
- 🛡️ Consider implementing rate limiting for production use
- 🔐 Run with limited user permissions when possible

## Requirements

- Node.js 18 or higher
- npm or yarn
- Access to a Veeam Backup & Replication server

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

[MIT](LICENSE)
