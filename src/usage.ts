import { CacheType, ChatInputCommandInteraction, GuildMember } from "discord.js";
import User from "./usermodel";
const premiumroles = ["1028760739936211026"];

export default async function ans(interaction: ChatInputCommandInteraction<CacheType>, member: GuildMember) {
  const user = await User.findOne({ userid: interaction.user.id });
  const prem = premiumroles.some((role) => member.roles.cache.has(role));

  if (user) {
    user.premium = prem;
    interaction.reply({
      embeds: [
        {
          title: `Bot Statistics`,
          description: `Track your statistics on the quota for the bot`,
          color: 0xdbeb71,
          fields: [
            {
              name: `Subscription`,
              value: user.premium ? "Premium" : "Free",
            },
            {
              name: `Last use`,
              value: user.lastUsed.toTimeString(),
            },
            ...(!user.premium
              ? [
                  {
                    name: `Next Available Answer`,
                    value: new Date(user.lastUsed.getTime() + 21_600_000).toTimeString(),
                  },
                ]
              : []),

            {
              name: `Total uses`,
              value: user.totalUsed.toString(),
            },
          ],
        },
      ],
    });
    await user.save();
  } else {
    interaction.reply({
      embeds: [
        {
          title: `Bot Statistics`,
          description: `Track your statistics on the quota for the bot`,
          color: 0xdbeb71,
          fields: [
            {
              name: `Subscription`,
              value: prem ? "Premium" : "Free",
            },
            {
              name: `Last use`,
              value: "No data",
            },
            {
              name: `Total uses`,
              value: "No data",
            },
          ],
        },
      ],
    });
  }
}
