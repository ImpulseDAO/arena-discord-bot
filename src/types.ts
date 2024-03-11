import { HexString } from "@polkadot/util/types"
import type { Awaitable, ClientEvents , Client} from "discord.js"

export type HandlerType<Event extends keyof ClientEvents> = (client: Client, ...args: ClientEvents[Event]) => Awaitable<void>
export type VoucherIssuedData = {
  owner: string;
  spender: string;
  voucherId: HexString;
}
