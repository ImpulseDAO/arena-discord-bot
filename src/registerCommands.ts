import { REST, Routes, SlashCommandBuilder } from 'discord.js';

export const commandNames = {
  voucher: 'voucher',
  // wallet: 'wallet' // @deprecated
} as const

export type CommandName = keyof typeof commandNames
  
/**
 * @deprecated // maybe we can use this in the future
 */
const walletCommand = new SlashCommandBuilder()
  .setName('wallet')
  .setDescription('Description')
  .addStringOption(
    option => option.setName('wallet').setDescription('Paste your wallet address here')
  )
  .toJSON() 

const commands: (Record<string, string> & { name: CommandName })[] = [
  {
    name: 'voucher',
    description: 'Starts voucher issuance process',
  },
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN ?? '');

(async () => {
  try {
    console.info('Started refreshing application (/) commands.');

    const url = Routes.applicationCommands(process.env.APPLICATION_ID ?? '')
    await rest.put(url, { body: commands });

    console.info('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})()
