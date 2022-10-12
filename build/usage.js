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
const usermodel_1 = __importDefault(require("./usermodel"));
const premiumroles = ["1028760739936211026"];
function ans(interaction, member) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield usermodel_1.default.findOne({ userid: interaction.user.id });
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
                                        value: new Date(user.lastUsed.getTime() + 21600000).toTimeString(),
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
            yield user.save();
        }
        else {
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
    });
}
exports.default = ans;
