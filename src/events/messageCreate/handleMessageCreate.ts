import { HandlerType } from "../../types"

export const handleMessageCreate: HandlerType<'messageCreate'> = async (client, message) => {
  if (message.author.bot) { return }

  /**
   * Do something
   */
}
