import 'module-alias/register'
import { Client, IntentsBitField, type Interaction } from 'discord.js'
import './config'
import { eventHandler } from './handlers/eventHandler'

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
    IntentsBitField.Flags.DirectMessages
  ]
})

eventHandler(client)

client.login(process.env.DISCORD_TOKEN)
