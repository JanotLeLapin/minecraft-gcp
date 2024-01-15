import { Client } from "discord.js"
import InstancesClient from "@google-cloud/compute"

import { statusPing, displayComponent } from "./status.js";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

const instances = new InstancesClient.v1.InstancesClient();

client.on("ready", () => console.log("Ready"));
client.on("messageCreate", async msg => {
  if (msg.content === "server start") {
    msg.reply("Démarrage du serveur...");
    await instances.start({
      project: "khadija-411118",
      instance: "minecraft",
      zone: "europe-west1-b"
    });
  } else if (msg.content === "server info") {
    statusPing(
      "34.77.37.184",
      25565,
      765,
      status => msg.reply(displayComponent(status.description))
    );
  }
});

client.login(process.env.TOKEN);
