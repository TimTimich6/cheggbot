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
exports.ans = void 0;
const discord_js_1 = require("discord.js");
const cheggapi_1 = require("./cheggapi");
const usermodel_1 = __importDefault(require("./usermodel"));
const allowedchannels = ["1028756668202352670"];
const premiumroles = ["1028760739936211026"];
function ans(interaction, guild, member, config) {
    return __awaiter(this, void 0, void 0, function* () {
        const prem = premiumroles.some((role) => member.roles.cache.has(role));
        let url = interaction.options.getString("url");
        let id = "";
        if (url.endsWith("exc"))
            id = new RegExp("\\d{13}").exec(url)[0];
        else
            id = url.substring((url === null || url === void 0 ? void 0 : url.lastIndexOf("q")) + 1);
        try {
            const user = yield usermodel_1.default.findOne({ userid: interaction.user.id });
            if (!allowedchannels.includes(interaction.channelId)) {
                return yield interaction.editReply({ content: "**❌ The bot may not be used in this channel!**" });
            }
            if (user) {
                console.log(user.premium, prem);
                if (!prem && user.lastUsed.getTime() + 21600000 > Date.now()) {
                    return yield interaction.editReply({ content: "**❌ Your free plan cooldown is not yet over!**" });
                }
                else {
                    user.totalUsed = user.totalUsed + 1;
                    user.lastUsed = new Date();
                    user.username = interaction.user.username + "#" + interaction.user.discriminator;
                    user.premium = prem;
                    yield user.save();
                }
            }
            else {
                const tosave = new usermodel_1.default({
                    userid: interaction.user.id,
                    lastUsed: new Date(),
                    totalUsed: 1,
                    premium: prem,
                    username: interaction.user.username + "#" + interaction.user.discriminator,
                });
                yield tosave.save();
            }
            url = url === null || url === void 0 ? void 0 : url.trim();
            console.log("url:", url);
            const domain = new URL(url).hostname;
            console.log(domain);
            if (!domain.includes("chegg"))
                throw "wrong domain";
            if (!id)
                throw "no id";
            console.log("id:", id);
            yield (0, cheggapi_1.firstReq)(url, config);
            yield (0, cheggapi_1.secondReq)(url, config);
            yield (0, cheggapi_1.finalreq)(url, id, config)
                .then((resp) => {
                return resp.text();
            })
                .then((text) => __awaiter(this, void 0, void 0, function* () {
                console.log(text);
                const data = JSON.parse(text);
                const answers = data.data.questionByLegacyId.htmlAnswers;
                if (answers) {
                    const attachments = answers.map((ans, index) => {
                        console.log(ans);
                        const html = ans.answerData.html;
                        const v1 = html.replaceAll(new RegExp("//", "gm"), "");
                        const v2 = v1.replaceAll(new RegExp("https:", "gm"), "");
                        const v3 = v2.replaceAll(new RegExp(`src="`, "gm"), `src="https://`);
                        console.log(v3);
                        const buff = Buffer.from(v3);
                        const att = new discord_js_1.AttachmentBuilder(buff, { name: `solutionQ${id}a${index + 1}.html`, description: `Solution to question ${id}` });
                        return att;
                    });
                    if (attachments) {
                        let texttosend = `✨  **Solutions for question** ${url}\n`;
                        for (let index = 0; index < attachments.length; index++) {
                            texttosend += `> 📄 **Solution #${index + 1}** by ${answers[index].answerData.author.firstName} ${answers[index].answerData.author.lastName}\n`;
                        }
                        yield interaction.user.send({ content: texttosend, files: attachments });
                        yield interaction.editReply({ content: "**📩 The answer has been sent to your DMs!**" });
                        yield interaction.client.channels.cache.get("1028938788329771048").send({
                            content: `📃 **${interaction.user.username}#${interaction.user.discriminator}**${prem ? "💸" : "🆓"} requested ${url} with QID **${id}** *<${new Date().toTimeString()}>* **(${process.env.ENV})**`,
                            files: attachments,
                        });
                    }
                    else {
                        yield interaction.editReply("❌ **Unable to retrieve information about the question.**");
                        yield interaction.client.channels.cache.get("1028938788329771048").send({
                            content: `❌ **${interaction.user.username}#${interaction.user.discriminator}**${prem ? "💸" : "🆓"} failed to get ${url} with QID **${id}** *<${new Date().toTimeString()}>* **(${process.env.ENV})**`,
                        });
                    }
                }
            }));
        }
        catch (error) {
            console.log(error);
            yield interaction.editReply({ content: "❌ **An error occurred while attempting to answer the question.**" });
            yield interaction.client.channels.cache.get("1028938788329771048").send({
                content: `❌ **${interaction.user.username}#${interaction.user.discriminator}**${prem ? "💸" : "🆓"} error while getting an answer for link ${url} with QID **${id}** *<${new Date().toTimeString()}>* **(${process.env.ENV})**`,
            });
        }
    });
}
exports.ans = ans;
