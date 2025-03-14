// tools/backup-proxies-tool.js
import fetch from "node-fetch";
import https from "https";
import { z } from "zod";

// Create an HTTPS agent that ignores self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

export default function(server) {
  // Add backup proxies tool
  server.tool(
    "get-proxies",
    {
      limit: z.number().min(1).max(1000).default(200).describe("Maximum number of proxies to retrieve"),
      skip: z.number().min(0).default(0).describe("Number of proxies to skip (for pagination)")
    },
    async (params) => {
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
        const { limit = 200, skip = 0 } = params;
        
        const response = await fetch(`https://${host}:9419/api/v1/backupInfrastructure/proxies?limit=${limit}&skip=${skip}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'x-api-version': '1.2-rev0',
            'Authorization': `Bearer ${token}`
          },
          agent: httpsAgent
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch proxies: ${response.statusText}`);
        }
        
        const proxiesData = await response.json();
        
        // Add a summary message at the beginning
        const total = proxiesData.pagination.total;
        const count = proxiesData.pagination.count;
        const summary = `Retrieved ${count} backup proxies out of ${total} total proxies`;
        
        // Format the data for better readability
        const formattedResult = {
          summary,
          proxies: proxiesData.data.map(proxy => ({
            id: proxy.id,
            name: proxy.name,
            description: proxy.description,
            type: proxy.type,
            transportMode: proxy.server.transportMode,
            maxTaskCount: proxy.server.maxTaskCount,
            failoverToNetwork: proxy.server.failoverToNetwork,
            hostToProxyEncryption: proxy.server.hostToProxyEncryption,
            autoSelectDatastores: proxy.server.connectedDatastores?.autoSelectEnabled
          })),
          pagination: proxiesData.pagination
        };
        
        return {
          content: [{ 
            type: "text", 
            text: JSON.stringify(formattedResult, null, 2)
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Error fetching proxies: ${error.message}` 
          }],
          isError: true
        };
      }
    }
  );
}