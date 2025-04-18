import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import vapiClient from '../utils/vapi';

export const data = new SlashCommandBuilder()
  .setName('status')
  .setDescription('Check the status of a Vapi call')
  .addStringOption(option =>
    option.setName('callid')
      .setDescription('The ID of the call to check')
      .setRequired(true));

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    // Defer the reply to give us time to process
    await interaction.deferReply();

    const callId = interaction.options.getString('callid');
    
    if (!callId) {
      await interaction.editReply('Please provide a valid call ID.');
      return;
    }

    // Get the call status
    const call = await vapiClient.calls.get(callId);

    // Calculate duration if possible
    let durationText = 'N/A';
    if (call.startedAt && call.endedAt) {
      const start = new Date(call.startedAt).getTime();
      const end = new Date(call.endedAt).getTime();
      const durationSec = Math.round((end - start) / 1000);
      durationText = `${durationSec} seconds`;
    } else if (call.startedAt) {
      const start = new Date(call.startedAt).getTime();
      const now = Date.now();
      const durationSec = Math.round((now - start) / 1000);
      durationText = `${durationSec} seconds (ongoing)`;
    }

    // Create an embed with the call information
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Call Status')
      .setDescription(`Status information for call ${callId}`)
      .addFields(
        { name: 'Status', value: call.status || 'Unknown' },
        { name: 'Created At', value: new Date(call.createdAt).toLocaleString() },
        { name: 'Duration', value: durationText }
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}` });

    // Reply with the embed
    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Error checking call status:', error);
    await interaction.editReply('There was an error checking the call status. Please ensure you provided a valid call ID.');
  }
}