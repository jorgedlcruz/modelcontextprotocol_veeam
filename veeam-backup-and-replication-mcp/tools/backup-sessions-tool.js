// tools/backup-sessions-tool.js
import fetch from "node-fetch";
import https from "https";
import { z } from "zod";

// Create an HTTPS agent that ignores self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

export default function(server) {
  // Add backup job sessions tool
  server.tool(
    "get-backup-sessions",
    {
      limit: z.number().min(1).max(1000).default(100).describe("Maximum number of sessions to retrieve"),
      skip: z.number().min(0).default(0).describe("Number of sessions to skip (for pagination)")
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
        const { limit = 100, skip = 0 } = params;
        
        const response = await fetch(`https://${host}:9419/api/v1/sessions?limit=${limit}&skip=${skip}&typeFilter=BackupJob`, {
          method: 'GET',
          headers: {
            'accept': 'application/json',
            'x-api-version': '1.2-rev0',
            'Authorization': `Bearer ${token}`
          },
          agent: httpsAgent
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch backup sessions: ${response.statusText}`);
        }
        
        const sessionsData = await response.json();
        
        // Add a summary message at the beginning
        const total = sessionsData.pagination.total;
        const count = sessionsData.pagination.count;
        const summary = `Retrieved ${count} backup job sessions out of ${total} total sessions`;
        
        // Format the data for better readability
        const formattedResult = {
          summary,
          sessions: sessionsData.data.map(session => ({
            id: session.id,
            name: session.name,
            sessionType: session.sessionType,
            state: session.state,
            platformName: session.platformName,
            creationTime: session.creationTime,
            endTime: session.endTime,
            progressPercent: session.progressPercent,
            result: session.result.result,
            message: session.result.message
          })),
          pagination: sessionsData.pagination
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
            text: `Error fetching backup sessions: ${error.message}` 
          }],
          isError: true
        };
      }
    }
  );
}