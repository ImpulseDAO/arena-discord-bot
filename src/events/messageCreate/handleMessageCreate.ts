import { HandlerType } from "../../types"

export const handleMessageCreate: HandlerType<'messageCreate'> = async (client, message) => {
  if (message.author.bot) { return }

  message.reply(`${message.content} ${message.content}`)
}
