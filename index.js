import { Client } from "discord.js"
import Functions from "@google-cloud/functions"

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

const functions = new Functions.v1.CloudFunctionsServiceClient();

client.on("ready", () => console.log("Ready"));
client.on("messageCreate", async msg => {
  if (msg.content === "server start") {
    msg.reply("Démarrage du serveur...");
    await functions.callFunction({ name: "start-instance" });
  }
});

client.login(process.env.TOKEN);
