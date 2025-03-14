// tools/auth-tool.js
import fetch from "node-fetch";
import https from "https";
import { z } from "zod";

// Create an HTTPS agent that ignores self-signed certificates
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

// Hardcoded credentials
const DEFAULT_HOST = "YOURIIPORFQDN";
const DEFAULT_USERNAME = ".\\YOURLOCALUSER";
const DEFAULT_PASSWORD = "YOURPASS";

// Authentication function that gets a token from VBR
async function authenticate(host, username, password) {
  try {
    const response = await fetch(`https://${host}:9419/api/oauth2/token`, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'x-api-version': '1.2-rev0',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: `grant_type=password&username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}&refresh_token=&code=&use_short_term_refresh=&vbr_token=`,
      agent: httpsAgent
    });
    
    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    throw error;
  }
}

export default function(server) {
  server.tool(
    "auth-vbr",
    {
      // All parameters optional
      host: z.string().describe("VBR server hostname or IP").optional(),
      username: z.string().describe("Username in domain\\user format").optional(),
      password: z.string().describe("Password").optional()
    },
    async (params = {}) => {
      try {
        const host = params.host || DEFAULT_HOST;
        const username = params.username || DEFAULT_USERNAME;
        const password = params.password || DEFAULT_PASSWORD;
        
        const token = await authenticate(host, username, password);
        
        // Store the token and host in a global variable for other tools to use
        global.vbrAuth = {
          host,
          token
        };
        
        return {
          content: [{ 
            type: "text", 
            text: `Authentication successful. Connected to ${host}. Token received and stored for subsequent API calls.` 
          }]
        };
      } catch (error) {
        return {
          content: [{ 
            type: "text", 
            text: `Authentication failed: ${error.message}` 
          }],
          isError: true
        };
      }
    }
  );
}