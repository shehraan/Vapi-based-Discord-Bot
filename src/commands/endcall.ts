import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import vapiClient from '../utils/vapi';

export const data = new SlashCommandBuilder()
  .setName('endcall')
  .setDescription('End a Vapi call')
  .addStringOption(option =>
    option.setName('callid')
      .setDescription('The ID of the call to end')
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

    // First, get the call to verify if this user created it
    const call = await vapiClient.calls.get(callId);

    // Check if the call name contains this user's name (basic check)
    const userName = interaction.user.username;
    const isUsersCall = call.name?.includes(userName) || call.name?.includes(interaction.user.tag);
    
    if (!isUsersCall) {
      await interaction.editReply('You can only end calls that you initiated.');
      return;
    }

    // End the call by deleting it
    await vapiClient.calls.delete(callId);

    // Create an embed with the result
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Call Ended')
      .setDescription(`Successfully ended call ${callId}`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}` });

    // Reply with the embed
    await interaction.editReply({ embeds: [embed] });
  } catch (error) {
    console.error('Error ending call:', error);
    await interaction.editReply('There was an error ending the call. Please ensure you provided a valid call ID.');
  }
}