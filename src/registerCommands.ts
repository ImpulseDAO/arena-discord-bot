import { REST, Routes, SlashCommandBuilder } from 'discord.js';

export const commandNames = {
  ping: 'ping',
  voucher: 'voucher',
  wallet: 'wallet'
} as const

export type CommandName = keyof typeof commandNames
type Command = {
  name: CommandName,
  description: string,

}
  
const commands: any[] = [
  {
    name: 'ping',
    description: 'Replies with Pong!',
  },
  {
    name: 'voucher',
    description: 'Starts voucher issuance process',
  },
  /**
   * Wallet 
   */
  new SlashCommandBuilder()
    .setName('wallet')
    .setDescription('Description')
    .addStringOption(
      option => option.setName('wallet').setDescription('Paste your wallet address here')
    )
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN ?? '');

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    const url = Routes.applicationCommands(process.env.APPLICATION_ID ?? '')
    await rest.put(url, { body: commands });

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.error(error);
  }
})()
