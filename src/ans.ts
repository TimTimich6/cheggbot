import { AttachmentBuilder, CacheType, ChatInputCommandInteraction, Guild, GuildMember, TextChannel } from "discord.js";
import { finalreq, firstReq, secondReq } from "./cheggapi";
import User from "./usermodel";

const allowedchannels = ["1028756668202352670"];
const premiumroles = ["1028760739936211026"];
export async function ans(interaction: ChatInputCommandInteraction<CacheType>, guild: Guild, member: GuildMember, config: Object) {
  const prem = premiumroles.some((role) => member.roles.cache.has(role));
  let url = <string>interaction.options.getString("url");
  let id = "";
  if (url.endsWith("exc")) id = new RegExp("\\d{13}").exec(url)![0];
  else id = url.substring(<number>url?.lastIndexOf("q") + 1);
  try {
    const user = await User.findOne({ userid: interaction.user.id });

    if (!allowedchannels.includes(interaction.channelId)) {
      return await interaction.reply({ content: "**❌ The bot may not be used in this channel!**", ephemeral: true });
    }
    if (user) {
      console.log(user.premium, prem);
      if (!prem && user.lastUsed.getTime() + 21_600_000 > Date.now()) {
        return await interaction.reply({ content: "**❌ Your free plan cooldown is not yet over!**", ephemeral: true });
      } else {
        user.totalUsed = user.totalUsed + 1;
        user.lastUsed = new Date();
        user.username = interaction.user.username + "#" + interaction.user.discriminator;
        user.premium = prem;
        await user.save();
      }
    } else {
      const tosave = new User({
        userid: interaction.user.id,
        lastUsed: new Date(),
        totalUsed: 1,
        premium: prem,
        username: interaction.user.username + "#" + interaction.user.discriminator,
      });
      await tosave.save();
    }
    url = url?.trim();
    console.log("url:", url);
    const domain = new URL(url).hostname;
    console.log(domain);

    if (!domain.includes("chegg")) throw "wrong domain";

    if (!id) throw "no id";
    console.log("id:", id);
    await firstReq(<string>url, config);
    await secondReq(<string>url, config);

    await finalreq(url, id, config)
      .then((resp) => {
        return resp.text();
      })
      .then(async (text) => {
        console.log(text);
        const data = JSON.parse(text);
        const answers = data.data.questionByLegacyId.htmlAnswers;
        if (answers) {
          const attachments = answers.map((ans: any, index: number) => {
            console.log(ans);
            const html = <string>ans.answerData.html;
            const v1 = html.replaceAll(new RegExp("//", "gm"), "");
            const v2 = v1.replaceAll(new RegExp("https:", "gm"), "");
            const v3 = v2.replaceAll(new RegExp(`src="`, "gm"), `src="https://`);
            console.log(v3);
            const buff = Buffer.from(v3);
            const att = new AttachmentBuilder(buff, { name: `solutionQ${id}a${index + 1}.html`, description: `Solution to question ${id}` });
            return att;
          });
          if (attachments) {
            let texttosend = `✨  **Solutions for question** ${url}\n`;
            for (let index = 0; index < attachments.length; index++) {
              texttosend += `> 📄 **Solution #${index + 1}** by ${answers[index].answerData.author.firstName} ${
                answers[index].answerData.author.lastName
              }\n`;
            }
            await interaction.user.send({ content: texttosend, files: attachments });
            await interaction.reply({ content: "**📩 The answer has been sent to your DMs!**", ephemeral: true });
            await (interaction.client.channels.cache.get("1028938788329771048") as TextChannel).send({
              content: `📃 **${interaction.user.username}#${interaction.user.discriminator}**${
                prem ? "💸" : "🆓"
              } requested ${url} with QID **${id}** *<${new Date().toTimeString()}>* **(${process.env.ENV})**`,
              files: attachments,
            });
          } else {
            await interaction.reply("❌ **Unable to retrieve information about the question.**");
            await (interaction.client.channels.cache.get("1028938788329771048") as TextChannel).send({
              content: `❌ **${interaction.user.username}#${interaction.user.discriminator}**${
                prem ? "💸" : "🆓"
              } failed to get ${url} with QID **${id}** *<${new Date().toTimeString()}>* **(${process.env.ENV})**`,
            });
          }
        }
      });
  } catch (error) {
    console.log(error);

    await interaction.reply({ content: "❌ **An error occurred while attempting to answer the question.**", ephemeral: true });
    await (interaction.client.channels.cache.get("1028938788329771048") as TextChannel).send({
      content: `❌ **${interaction.user.username}#${interaction.user.discriminator}**${
        prem ? "💸" : "🆓"
      } error while getting an answer for link ${url} with QID **${id}** *<${new Date().toTimeString()}>* **(${process.env.ENV})**`,
    });
  }
}
