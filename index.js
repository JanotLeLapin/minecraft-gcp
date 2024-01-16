import { Client } from "discord.js"
import InstancesClient from "@google-cloud/compute"

import { statusPing, displayComponent } from "./status.js";

const client = new Client({
  intents: ["Guilds", "GuildMessages", "MessageContent"],
});

const instances = new InstancesClient.v1.InstancesClient();

const REQUEST = {
  project: "khadija-411118",
  instance: "minecraft",
  zone: "europe-west1-b"
};

/**
  * @returns {Promise<"PROVISIONING" | "STAGING" | "RUNNING" | "STOPPING" | "REPAIRING" | "TERMINATED" | "SUSPENDING" | "SUSPENDED">}
  */
const fetchStatus = async () => {
  const instance = await instances.get(REQUEST).then(res => res[0]);
  return instance.status;
}

client.on("ready", () => console.log("Ready"));
client.on("messageCreate", async msg => {
  if (msg.content === "server start") {
    const status = await fetchStatus();
    switch (status) {
      case "STAGING":
        msg.reply("Le serveur est déjà en train de démarrer.");
        return;
      case "RUNNING":
        msg.reply("Le serveur est actif.");
        return;
      default:
        break;
    }
    msg.reply("Démarrage du serveur...");
    await instances.start(REQUEST);
  } else if (msg.content === "server info") {
    let message;
    try {
      const response = await statusPing("34.77.37.184", 25565, 765);
      message = displayComponent(response.description);
    } catch (e) {
      console.error(e);
      message = "Connexion au serveur impossible.";
    }
    msg.reply(message);
  } else if (msg.content === "server stop") {
    const status = await fetchStatus();
    switch (status) {
      case "STOPPING":
        msg.reply("Le serveur a déjà été arrêté.");
        return;
      case "TERMINATED":
        msg.reply("Le serveur est inactif.");
        return;
      default:
        break;
    }
    msg.reply("Arrêt du serveur...");
    await instances.stop(REQUEST);
  }
});

client.login(process.env.TOKEN);
