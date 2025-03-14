// tools/backup-repositories-tool.js
import fetch from "node-fetch";
import https from "https";
import { z } from "zod";

// Create an HTTPS agent that ignores self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

export default function(server) {
  // Add backup repositories tool
  server.tool(
    "get-repositories",
    {
      limit: z.number().min(1).max(1000).default(200).describe("Maximum number of repositories to retrieve"),
      skip: z.number().min(0).default(0).describe("Number of repositories to skip (for pagination)"),
      threshold: z.number().min(1).max(99).default(20).describe("Warning threshold percentage for free space")
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
        const { limit = 200, skip = 0, threshold = 20 } = params;
        
        const response = await fetch(`https://${host}:9419/api/v1/backupInfrastructure/repositories/states?limit=${limit}&skip=${skip}`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'x-api-version': '1.2-rev0',
            'Authorization': `Bearer ${token}`
          },
          agent: httpsAgent
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch repositories: ${response.statusText}`);
        }
        
        const reposData = await response.json();
        
        // Process repositories and categorize them
        const repos = reposData.data.map(repo => {
          // Calculate free space percentage
          let freeSpacePercent = 0;
          let status = "Unknown";
          let statusDetails = "";
          
          // For repos that report capacity
          if (repo.capacityGB > 0) {
            freeSpacePercent = Math.round((repo.freeGB / repo.capacityGB) * 100);
            
            if (!repo.isOnline) {
              status = "Offline";
              statusDetails = "Repository is offline and cannot be accessed";
            } else if (freeSpacePercent <= threshold) {
              status = "Warning";
              statusDetails = `Low free space (${freeSpacePercent}%)`;
            } else {
              status = "Healthy";
              statusDetails = `Good free space (${freeSpacePercent}%)`;
            }
          } 
          // For object storage or offline repos
          else {
            if (!repo.isOnline) {
              status = "Offline";
              statusDetails = "Repository is offline and cannot be accessed";
            } else if (repo.type.includes("Cloud")) {
              status = "Cloud";
              statusDetails = "Object storage with unlimited capacity";
            } else {
              status = "Unknown";
              statusDetails = "Unable to determine free space";
            }
          }
          
          return {
            id: repo.id,
            name: repo.name,
            description: repo.description,
            type: repo.type,
            path: repo.path,
            hostName: repo.hostName || "N/A",
            capacityGB: repo.capacityGB,
            freeGB: repo.freeGB,
            usedSpaceGB: repo.usedSpaceGB,
            isOnline: repo.isOnline,
            freeSpacePercent,
            status,
            statusDetails
          };
        });
        
        // Group repositories by status
        const healthy = repos.filter(r => r.status === "Healthy");
        const warnings = repos.filter(r => r.status === "Warning");
        const offline = repos.filter(r => r.status === "Offline");
        const cloud = repos.filter(r => r.status === "Cloud");
        const unknown = repos.filter(r => r.status === "Unknown");
        
        // Create summary
        const summary = {
          total: repos.length,
          healthy: healthy.length,
          warnings: warnings.length,
          offline: offline.length,
          cloud: cloud.length,
          unknown: unknown.length
        };
        
        // Format the data for better readability
        const formattedResult = {
          summary,
          warnings: warnings.length > 0 ? warnings : [],
          offline: offline.length > 0 ? offline : [],
          healthy: healthy.length > 0 ? healthy : [],
          cloud: cloud.length > 0 ? cloud : [],
          unknown: unknown.length > 0 ? unknown : [],
          pagination: reposData.pagination
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
            text: `Error fetching repositories: ${error.message}` 
          }],
          isError: true
        };
      }
    }
  );
}