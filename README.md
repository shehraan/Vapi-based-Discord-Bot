# Vapi Discord Bot

A Discord bot that allows making voice calls with Vapi's AI assistants.

## Features

- Create web calls with Vapi assistants
- Check call status
- List recent calls
- End ongoing calls

## Setup

1. Clone the repository
2. Install dependencies
   ```
   npm install
   ```
3. Copy `.env.example` to `.env` and fill it with these credentials:
   - DISCORD_CLIENT_ID: 1361016921104973904 
   - DISCORD_TOKEN: MTM2MTAxNjkyMTEwNDk3MzkwNA.GNrCTX.GBHQAllpLWolqG5hl-oWmICQFEhlwle3Z24UOg 
   - VAPI_PRIVATE_KEY: Your Vapi private API key
   - VAPI_PUBLIC_KEY: Your Vapi public API key
   - VAPI_ASSISTANT_ID: ID of the Vapi assistant to use

4. Build the application
   ```
   npm run build
   ```

5. Deploy commands
   ```
   node dist/deploy-commands.js
   ```

6. Start the bot
   ```
   npm start
   ```

## Commands

- `/call <name> [question]` - Start a call with the Vapi assistant
- `/status <callid>` - Check the status of a call
- `/list [limit]` - List your recent calls (default limit: 5)
- `/endcall <callid>` - End a specific call
- `/help` - Display help information

## Development

For development, you can use:
```
npm run dev
```

This will start the bot with nodemon, which automatically restarts when you make changes to the code.

## License

ISC
