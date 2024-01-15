import type {   Client,  ClientEvents } from "discord.js"
import { handleReady } from "../events/ready/handleReady"
import { handleInteractionCreate } from "../events/interactionCreate"
import { handleMessageCreate } from "../events/messageCreate/handleMessageCreate"

const handlers: {
  [key in keyof ClientEvents]?: Function
}= {
  ready: handleReady,
  interactionCreate: handleInteractionCreate,
  messageCreate: handleMessageCreate
}

export const eventHandler = (client: Client) => {
  Object.entries(handlers).forEach(([eventName, handler]) => {
    client.on(eventName, (...args) => handler(client, ...args))
  })
}
