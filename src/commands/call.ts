import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import vapiClient from '../utils/vapi';
import { Call } from '@vapi-ai/server-sdk/dist/api';

export const data = new SlashCommandBuilder()
  .setName('call')
  .setDescription('Start a call with Vapi assistant')
  .addStringOption(option =>
    option.setName('name')
      .setDescription('Your name for the call')
      .setRequired(true))
  .addStringOption(option =>
    option.setName('question')
      .setDescription('Initial question or topic')
      .setRequired(false));

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    // Defer the reply to give us time to process
    await interaction.deferReply();

    const name = interaction.options.getString('name') || 'User';
    const question = interaction.options.getString('question') || '';

    // Create a web call with the Vapi assistant
    const response = await vapiClient.calls.create({
      assistantId: process.env.VAPI_ASSISTANT_ID || '',
      // Store user info and question as call name
      name: `Discord call by ${name}: ${question}`
    });

    // Handle the response, which could be a Call or a CallBatchResponse
    // In our case, it should be a Call object
    if ('id' in response) {
      // It's a Call object
      const call = response as Call;
      
      // Create an embed with the call information
      const embed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle('Vapi Call Created!')
        .setDescription(`A call has been created for you with our assistant.`)
        .addFields(
          { name: 'Call ID', value: call.id || 'Unknown' },
          { name: 'Status', value: call.status || 'Unknown' }
        )
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}` });

      // Reply with the embed
      await interaction.editReply({ embeds: [embed] });
    } else {
      // It's a CallBatchResponse or unexpected response
      await interaction.editReply('Call created, but received an unexpected response format. Please check your Vapi dashboard for details.');
    }
  } catch (error) {
    console.error('Error creating call:', error);
    await interaction.editReply('Calling...');
  }
}