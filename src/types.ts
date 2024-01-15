import type { Awaitable, ClientEvents , Client} from "discord.js"

export type HandlerType<Event extends keyof ClientEvents> = (client: Client, ...args: ClientEvents[Event]) => Awaitable<void>
