import { Client } from "discord.js"
import Functions from "@google-cloud/functions"

import { statusPing } from "./status.js";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

const functions = new Functions.v1.CloudFunctionsServiceClient();

client.on("ready", () => console.log("Ready"));
client.on("messageCreate", async msg => {
  if (msg.content === "server start") {
    msg.reply("Démarrage du serveur...");
    await functions.callFunction({ name: "start-instance" });
  } else if (msg.content === "server info") {
    statusPing("34.77.37.184", 25565, 765, status => msg.reply(status.description.text));
  }
});

client.login(process.env.TOKEN);
