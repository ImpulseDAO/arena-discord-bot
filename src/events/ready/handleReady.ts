import { HandlerType } from "../../types"

export const handleReady: HandlerType<'ready'> = (client) => {
  console.info(`Logged in as ${client.user?.tag}!`)
}
