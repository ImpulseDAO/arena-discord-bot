import { HandlerType } from "../../types"

export const handleReady: HandlerType<'ready'> = (client) => {
  console.log(`Logged in as ${client.user?.tag}!`)
}
