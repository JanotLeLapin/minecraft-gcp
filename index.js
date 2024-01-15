import { Client } from "discord.js"
import Compute from "@google-cloud/compute"

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

const compute = new Compute.v1.InstancesClient();

client.on("ready", () => console.log("Ready"));
client.on("messageCreate", async msg => {
  if (msg.content === "server start") {
    msg.reply("Démarrage du serveur...");
    await compute.start({
      project: "khadija-411118",
      instance: "minecraft",
      zone: "europe-west1-b",
    });
  }
});

client.login(process.env.TOKEN);
