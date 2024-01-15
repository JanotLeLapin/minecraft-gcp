import { Client } from "discord.js"

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

client.on("messageCreate", msg => {
  console.log(msg.content);
});
