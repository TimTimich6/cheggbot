import mongoose from "mongoose";
import { Client, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import { ans } from "./ans";
import usage from "./usage";
dotenv.config();

const client = new Client({ intents: ["Guilds", "DirectMessages"] });

const commands = [
  {
    name: "ans",
    description: "Gets the answer to a chegg link",
    options: [
      {
        name: "url",
        description: "Input the url of the chegg question",
        type: 3,
        required: true,
      },
    ],
  },
  {
    name: "usage",
    description: "Gets the statistics and usage for your account",
  },
];

const rest = new REST({ version: "10" }).setToken(<string>process.env.TOKEN);

client.once("ready", async () => {
  console.log("ready");
});

console.log(process.env.AUTH);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.guildId) await interaction.reply("**✨ Join https://discord.gg/agsC32Yf5x to use the bot!** ");
  else {
    const guild = await client.guilds.fetch(<string>interaction.guildId);
    if (guild) {
      const member = guild.members.cache.get(<string>interaction.member?.user.id);

      if (interaction.commandName === "ans") {
        ans(interaction, guild, member!);
      }
      if (interaction.commandName === "usage") {
        usage(interaction, member!);
      }
    }
  }
});
const uri: string = `mongodb+srv://tim:${process.env.MONGO_PASSWORD}@cluster0.k1aaw.mongodb.net/cheggbot?retryWrites=true&w=majority`;

(async () => {
  await rest.put(Routes.applicationCommands(<string>process.env.CLIENTID), { body: commands });
  mongoose.connect(uri).catch((err: unknown) => {
    console.error(err);
  });
  mongoose.set("runValidators", true);
})();
client.login(process.env.TOKEN);
