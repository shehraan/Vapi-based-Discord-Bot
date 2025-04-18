import { Client, Events, GatewayIntentBits, Collection } from 'discord.js';
import { config } from 'dotenv';
import { readdirSync } from 'fs';
import path from 'path';
import Logger from './utils/logger';

// Load environment variables
config();

// Create a new client instance
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
  ],
});

// Define commands collection
interface Command {
  data: any;
  execute: (interaction: any) => Promise<void>;
}

declare module 'discord.js' {
  export interface Client {
    commands: Collection<string, Command>;
  }
}

client.commands = new Collection();

// Load commands
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = readdirSync(commandsPath).filter(file => file.endsWith('.js') || file.endsWith('.ts'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);
  
  if ('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

// When the client is ready
client.once(Events.ClientReady, (c) => {
  Logger.info(`✅ Bot is online and ready! Logged in as ${c.user.tag}`);
  Logger.info(`⚡ Bot is in ${client.guilds.cache.size} servers`);
});

// Handle slash commands
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  Logger.command(interaction.commandName, interaction.user.id, 'start');
  
  const command = client.commands.get(interaction.commandName);

  if (!command) {
    Logger.error(`No command matching ${interaction.commandName} was found.`);
    try {
      await interaction.reply({ content: 'Unknown command. Please try /help for available commands.', ephemeral: true });
    } catch (error) {
      Logger.error('Failed to respond to unknown command', error);
    }
    return;
  }

  try {
    // First, acknowledge the command immediately to prevent timeouts
    if (!interaction.deferred && !interaction.replied) {
      await interaction.deferReply();
      Logger.debug(`Deferred reply for ${interaction.commandName}`);
    }
    
    // Then execute the command
    await command.execute(interaction);
    
    Logger.command(interaction.commandName, interaction.user.id, 'complete');
  } catch (error) {
    Logger.error(`Error executing command ${interaction.commandName}:`, error);
    Logger.command(interaction.commandName, interaction.user.id, 'error');
    
    // Make sure we respond to the user
    try {
      if (interaction.deferred) {
        await interaction.editReply({ content: 'There was an error while executing this command! Please try again later.' });
      } else if (!interaction.replied) {
        await interaction.reply({ content: 'There was an error while executing this command! Please try again later.', ephemeral: true });
      }
    } catch (replyError) {
      Logger.error('Error sending error response:', replyError);
    }
  }
});

// Error handling
process.on('uncaughtException', (error) => {
  Logger.error('Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  Logger.error('Unhandled Promise Rejection:', error);
});

// Login to Discord with your token
client.login(process.env.DISCORD_TOKEN)
  .then(() => {
    Logger.info('Successfully logged in to Discord');
  })
  .catch(error => {
    Logger.error('Error during login:', error);
  });

// Keep the bot running
function keepAlive() {
  return setInterval(() => {
    Logger.info(`Bot heartbeat - Still alive`);
  }, 300000); // Log every 5 minutes
}

// Start heartbeat
const heartbeat = keepAlive();