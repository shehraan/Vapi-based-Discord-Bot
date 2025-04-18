import { VapiClient } from '@vapi-ai/server-sdk';
import { config } from 'dotenv';

// Load environment variables if not already loaded
config();

// Create a Vapi client instance
const vapiClient = new VapiClient({
  token: process.env.VAPI_PRIVATE_KEY || '',
});

export default vapiClient;