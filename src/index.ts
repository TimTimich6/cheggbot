import mongoose from "mongoose";
import { Client, REST, Routes, TextChannel } from "discord.js";
import dotenv from "dotenv";
import { ans } from "./ans";
import usage from "./usage";
import axios from "axios";
dotenv.config();

const client = new Client({ intents: ["Guilds", "DirectMessages"] });
let config: any;
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
  await (client.channels.cache.get("1028933696809615361") as TextChannel).send(
    `✅ Bot is up on **${process.env.ENV}** *<${new Date().toTimeString()}>*`
  );
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (!interaction.guildId) await interaction.reply("**✨ Join https://discord.gg/agsC32Yf5x to use the bot!** ");
  else {
    const guild = await client.guilds.fetch(<string>interaction.guildId);
    if (guild) {
      const member = guild.members.cache.get(<string>interaction.member?.user.id);

      if (interaction.commandName === "ans") {
        await interaction.deferReply();
        ans(interaction, guild, member!, config);
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
  const { data } = await axios.get(<string>process.env.PANTRY, {
    headers: { "Content-type": "application/json" },
  });
  config = data;
  console.log(config);

  mongoose.set("runValidators", true);
})();
client.login(process.env.TOKEN);
