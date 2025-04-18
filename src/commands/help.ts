import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import Logger from '../utils/logger';

export const data = new SlashCommandBuilder()
  .setName('help')
  .setDescription('Get help with using the Vapi bot');

export async function execute(interaction: ChatInputCommandInteraction) {
  try {
    Logger.debug('Executing help command...');
    
    const embed = new EmbedBuilder()
      .setColor(0x0099FF)
      .setTitle('Vapi Discord Bot Help')
      .setDescription('Here are the commands you can use with the Vapi Discord Bot:')
      .addFields(
        { name: '/call', value: 'Start a call with the Vapi assistant. You can provide your name and an optional initial question.' },
        { name: '/status', value: 'Check the status of a specific call by providing the call ID.' },
        { name: '/list', value: 'List your recent calls. You can specify how many calls to list (default is 5).' },
        { name: '/endcall', value: 'End a specific call by providing the call ID.' },
        { name: '/help', value: 'Show this help message.' }
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}` });

    // Reply immediately without deferring
    await interaction.reply({ embeds: [embed], ephemeral: true });
    Logger.debug('Help command completed successfully');
  } catch (error) {
    Logger.error('Error in help command:', error);
    if (!interaction.replied) {
      await interaction.reply({ content: 'Error displaying help. Please try again.', ephemeral: true });
    }
  }
}