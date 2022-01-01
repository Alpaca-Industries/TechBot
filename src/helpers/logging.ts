import { MessageEmbed, Message } from "discord.js"

export function sendError(message, title, description) {
    const errorEmbed = new MessageEmbed()
      .setTitle(`Error: ${title}`)
      .setDescription(description)
      .setColor("RED")
    message.channel.send({embeds: errorEmbed})
}