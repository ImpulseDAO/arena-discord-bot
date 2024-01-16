import { ChatInputCommandInteraction} from "discord.js"
import { HandlerType } from "../../types"
import { type CommandName } from "../../registerCommands"
//
import { handleVoucherCommand } from "./handleVoucherCommand"

export const handleInteractionCreate: HandlerType<'interactionCreate'> = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return
  
  processInteraction(interaction)
}

const processInteraction = async (interaction: ChatInputCommandInteraction) => {
  const commandName = interaction.commandName as CommandName

  switch (commandName) {
    case 'voucher':
      await handleVoucherCommand(interaction)
      break;
  
    default:
       // makes sure that all cases are handled
      exhaustiveCheck(commandName)
  }
}

const exhaustiveCheck = (value: never) => {}
