import 'module-alias/register'
import { Client, IntentsBitField } from 'discord.js'
import './config'
import { eventHandler } from './handlers/eventHandler'

export const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages
  ]
})

eventHandler(client)

client.login(process.env.DISCORD_TOKEN)

export const discordClient = client
