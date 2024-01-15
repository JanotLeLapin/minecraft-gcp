import { Client } from "discord.js"

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

client.on("ready", () => console.log("Ready"));
client.on("messageCreate", msg => {
  console.log(msg.content);
});

client.login(process.env.TOKEN);
