// tools/server-info-tool.js
import fetch from "node-fetch";
import https from "https";

// Create an HTTPS agent that ignores self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

export default function(server) {
  // Add server info tool
  server.tool(
    "get-server-info",
    { },
    async () => {
      try {
        if (!global.vbrAuth) {
          return {
            content: [{ 
              type: "text", 
              text: "Not authenticated. Please call auth-vbr tool first." 
            }],
            isError: true
          };
        }
        
        const { host, token } = global.vbrAuth;
        
        const response = await fetch(`https://${host}:9419/api/v1/serverInfo`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'x-api-version': '1.2-rev0',
            'Authorization': `Bearer ${token}`
          },
          agent: httpsAgent
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch server info: ${response.statusText}`);
        }
        
        const serverInfo = await response.json();
        
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(serverInfo, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Error fetching server info: ${error.message}` 
          }],
          isError: true
        };
      }
    }
  );
}