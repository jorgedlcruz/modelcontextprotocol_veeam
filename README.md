# Model Context Protocol for Veeam

<p align="center">
  <img src="veeam-backup-and-replication-mcp/assets/mcp-veeam-logo.png" alt="MCP Veeam Logo" width="220" height="220" />
</p>

<p align="center">
  <strong>Democratizing AI access to Veeam's powerful data protection ecosystem</strong>
</p>

<p align="center">
  <a href="#vision">Vision</a> |
  <a href="#components">Components</a> |
  <a href="#getting-started">Getting Started</a> |
  <a href="#use-cases">Use Cases</a> |
  <a href="#roadmap">Roadmap</a>
</p>

## Vision

The Model Context Protocol for Veeam project aims to bridge the gap between artificial intelligence and Veeam's robust data protection ecosystem. By leveraging the Model Context Protocol (MCP), I am enabling AI assistants to directly interact with Veeam's feature-rich APIs, creating new possibilities for data management, monitoring, and protection.

My goal is to democratize access to Veeam's powerful capabilities through natural language, allowing administrators, DevOps engineers, and IT professionals to:

- 💬 Interact with Veeam products through conversational AI
- 🔍 Get instant insights into backup infrastructure
- 📊 Receive proactive recommendations and analysis
- 🛠️ Troubleshoot issues with AI-assisted guidance
- 🤖 Automate routine tasks through natural language commands

## Components

This repository hosts a collection of MCP servers for different Veeam products:

| Component | Status | Description |
|-----------|--------|-------------|
| [Veeam Backup & Replication](./veeam-backup-and-replication-mcp) | ✅ Available | Monitor and manage VBR servers, jobs, repositories, and proxies |
| [Veeam ONE](./veeam-one-mcp) | 🚧 In Development | Access monitoring, reporting, and business view capabilities |
| [Veeam Service Provider Console](./veeam-service-provider-console-mcp) | 🔮 Planned | Manage multi-tenant environments and service provider operations |
| [Veeam Recovery Orchestrator](./veeam-availability-orchestrator-mcp) | 🔮 Planned | Orchestrate disaster recovery testing and execution |
| [Kasten K10](./kasten-k10-mcp) | 🔮 Planned | Kubernetes-native backup and disaster recovery |

## Getting Started

Each MCP server has its own detailed installation and usage instructions. To get started with the Veeam Backup & Replication MCP server:

```bash
# Clone the repository
git clone https://github.com/jorgedlcruz/modelcontextprotocol_veeam.git
cd modelcontextprotocol_veeam/veeam-backup-and-replication-mcp

# Install dependencies
npm install

# Start the server, not required if you use Claude Desktop
node vbr-mcp-server.js
```

Connect to the server using any MCP-compatible client or AI assistant, such as Claude or compatible models that support function calling through the Model Context Protocol.

### Claude Desktop Configuration

If you are using Claude Desktop, one of the most powerful MCP Client anyways, you surely have already the Developer Mode enabled, and all, please add the next configuiration to your claude_desktop_config.json

```bash
{
  "mcpServers": {
    "Veeam API": {
      "command": "node",
      "args": ["C:/yourpath/vbr-mcp-server.js"]
    }
  }
}
```

## Use Cases

### IT Administrators
- "Show me all failed backup jobs from the last 24 hours"
- "Is there any repository approaching capacity threshold?"
- "What's our current license usage and when does it expire?"
- "Which VMs had the largest backup size increase this week?"

### DevOps Engineers
- "Check if our production SQL Server was successfully backed up last night"
- "Compare restore points available for the web application servers"
- "Verify backup copies were successfully transferred to our DR site"

### Service Providers (future)
- "Which tenants have the highest backup growth rate this month?"
- "Show me customers with backup jobs consistently failing"
- "Generate a license consumption report for quarterly billing"

## Roadmap

- 🚀 **Milestone 1**: Complete Veeam Backup & Replication MCP server with full feature coverage
- 🚀 **Milestone 2**: Release Veeam ONE MCP server
- 🚀 **Milestone 3**: Release VSPC MCP server
- 🚀 **Milestone 4**: Release VRO and K10 MCP servers
- 🚀 **Ongoing**: Enhance existing servers with additional capabilities and improved AI context

## Contributing

I would truly welcome contributions from the community! Whether you're interested in adding support for new Veeam APIs, improving documentation, or enhancing the core functionality, please feel free to submit pull requests or open issues.

See our [contribution guidelines](CONTRIBUTING.md) for more details.

## Why MCP?

The Model Context Protocol provides a standardized way for AI systems to interact with external tools and data sources. By implementing MCP servers for Veeam products, we enable:

- 🔌 **Interoperability**: Works with any AI assistant that supports the protocol
- 🧩 **Modularity**: Each tool is self-contained and well-documented
- 🔒 **Security**: Clear separation between AI systems and your infrastructure
- 🚀 **Extensibility**: Easy to add new capabilities as Veeam APIs evolve

## License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">
  Built with 💙 by the Veeam community
</p>
