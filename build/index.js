"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const ans_1 = require("./ans");
const usage_1 = __importDefault(require("./usage"));
const axios_1 = __importDefault(require("axios"));
dotenv_1.default.config();
const client = new discord_js_1.Client({ intents: ["Guilds", "DirectMessages"] });
let config;
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
const rest = new discord_js_1.REST({ version: "10" }).setToken(process.env.TOKEN);
client.once("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("ready");
    yield client.channels.cache.get("1028933696809615361").send(`✅ Bot is up on **${process.env.ENV}** *<${new Date().toTimeString()}>*`);
}));
client.on("interactionCreate", (interaction) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    if (!interaction.isChatInputCommand())
        return;
    if (!interaction.guildId)
        yield interaction.reply("**✨ Join https://discord.gg/agsC32Yf5x to use the bot!** ");
    else {
        const guild = yield client.guilds.fetch(interaction.guildId);
        if (guild) {
            const member = guild.members.cache.get((_a = interaction.member) === null || _a === void 0 ? void 0 : _a.user.id);
            if (interaction.commandName === "ans") {
                yield interaction.deferReply();
                (0, ans_1.ans)(interaction, guild, member, config);
            }
            if (interaction.commandName === "usage") {
                (0, usage_1.default)(interaction, member);
            }
        }
    }
}));
const uri = `mongodb+srv://tim:${process.env.MONGO_PASSWORD}@cluster0.k1aaw.mongodb.net/cheggbot?retryWrites=true&w=majority`;
(() => __awaiter(void 0, void 0, void 0, function* () {
    yield rest.put(discord_js_1.Routes.applicationCommands(process.env.CLIENTID), { body: commands });
    mongoose_1.default.connect(uri).catch((err) => {
        console.error(err);
    });
    const { data } = yield axios_1.default.get(process.env.PANTRY, {
        headers: { "Content-type": "application/json" },
    });
    config = data;
    console.log(config);
    mongoose_1.default.set("runValidators", true);
}))();
client.login(process.env.TOKEN);
