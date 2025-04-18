import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import vapiClient from '../utils/vapi';

export const data = new SlashCommandBuilder()
  .setName('list')
  .setDescription('List your recent Vapi calls')
  .addIntegerOption(option =>
    option.setName('limit')
      .setDescription('Number of calls to list (default: 5)')
      .setRequired(false)
      .setMinValue(1)
      .setMaxValue(10));

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    // Defer the reply to give us time to process
    await interaction.deferReply();

    const limit = interaction.options.getInteger('limit') || 5;
    
    // Get recent calls - we'll filter on the client side since SDK doesn't support complex filters
    const calls = await vapiClient.calls.list({
      limit
    });

    // Filter to show only calls that have a name containing this user's name (basic approach)
    const userName = interaction.user.username;
    const userCalls = calls.filter(call => call.name?.includes(userName) || call.name?.includes(interaction.user.tag));

    if (userCalls.length === 0) {
      await interaction.editReply('You have no recent calls.');
      return;
    }

    // Create an embed with the calls information
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Your Recent Calls')
      .setDescription(`Here are your ${userCalls.length} most recent calls:`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}` });
    
    // Add fields for each call
    userCalls.forEach((call, index) => {
      // Calculate how long ago the call was created
      const createdDate = new Date(call.createdAt);
      const timeAgo = getTimeAgo(createdDate);

      embed.addFields({
        name: `Call ${index + 1} - ${call.id}`,
        value: `**Status**: ${call.status || 'Unknown'}\n**Created**: ${timeAgo}\n**Name**: ${call.name || 'Unnamed call'}`
      });
    });

    // Reply with the embed
    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Error listing calls:', error);
    await interaction.editReply('There was an error listing your calls. Please try again later.');
  }
}

// Helper function to show time in a human-readable format
function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  
  if (diffSec < 60) return `${diffSec} seconds ago`;
  
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin} minutes ago`;
  
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} hours ago`;
  
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay < 30) return `${diffDay} days ago`;
  
  return date.toLocaleDateString();
}