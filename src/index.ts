import { ApplicationCommandOptionWithChoicesAndAutocompleteMixin, Attachment, AttachmentBuilder, Client, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import axios from "axios";
import fetch from "node-fetch";
import { firstReq, secondReq } from "./cheggapi";
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
];

const rest = new REST({ version: "10" }).setToken(<string>process.env.TOKEN);

client.once("ready", async () => {
  console.log("ready");
});

console.log(process.env.AUTH);

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName === "ans") {
    let url = <string>interaction.options.getString("url");
    url = url?.trim();
    console.log("url:", url);

    const index = <number>url?.lastIndexOf("q") + 1;
    const id = url?.substring(index);
    console.log("id:", id);
    await firstReq(<string>url), await secondReq(<string>url);

    await fetch("https://gateway.chegg.com/one-graph/graphql", {
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.9,es;q=0.8",
        "apollographql-client-name": "chegg-web",
        "apollographql-client-version": "main-50430f42-3139728262",
        authorization: `Basic ${process.env.AUTH}`,
        "content-type": "application/json",
        "sec-ch-ua": '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-site",
        "x-chegg-referrer": <string>url,
        cookie:
          "AMCV_3FE7CBC1556605A77F000101%40AdobeOrg=-408604571%7CMCIDTS%7C18837%7CMCMID%7C80357559670330189053311125690101883553%7CMCAID%7CNONE%7CMCOPTOUT-1627450396s%7CNONE%7CvVersion%7C4.6.0; V=c37a0b417b2323ed38daeb452c8d0c1f62146390056040.34948491; C=0; O=0; exp=C026A; CVID=9efa4471-3b76-400f-9640-e26e71298e54; expkey=8427397BD30FCD57D82BA3551FE3E71E; CSessionID=19ab3a49-f73f-47c7-9a60-751bb5421c80; PHPSESSID=qk9llmgbn5r7edi26bli9vcv3u; user_geo_location=%7B%22country_iso_code%22%3A%22US%22%2C%22country_name%22%3A%22United+States%22%2C%22region%22%3A%22CA%22%2C%22region_full%22%3A%22California%22%2C%22city_name%22%3A%22Rancho+Palos+Verdes%22%2C%22postal_code%22%3A%2290275%22%2C%22locale%22%3A%7B%22localeCode%22%3A%5B%22en-US%22%5D%7D%7D; pxcts=c4f0ae0e-45f0-11ed-b692-595369797142; _pxvid=c4f0a258-45f0-11ed-b692-595369797142; id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhdmlkbGxhbmRyeTFAZ21haWwuY29tIiwiaXNzIjoiaHViLmNoZWdnLmNvbSIsInN1YiI6ImEyZDViNDg4LTY5ZjgtNGEzYy05NGFjLTYyY2UxODg2YWRkMSIsImF1ZCI6IkNIR0ciLCJpYXQiOjE2NjUxMTM2NDEsImV4cCI6MTY4MDY2NTY0MSwicmVwYWNrZXJfaWQiOiJhcHcifQ.F31NVVvv7o_mNNIYGBV0IXHEZH5WYlk-Z0YbBzlagMyVKvANWe-7_2zm4SVvurpvDS1YQFghIFAOfZNR4FYzPhOJr1M9MuGzBcnj174LkJW7EIAXIS-YwKCHm40qnz5JrnhYjWgeZUIqD0rv1H1Q_-jkbxl7NkEfK0sB_2ymCDDdRqcUzgo2SSzCESfpWtQmbCcYX5iTdKj-WhyN9obtFdUl1A_jk1Bl1gr7JJPtt97mRP6i65J7ghUg9XOtrPq8bkn4WrkmtV-3_Sd_WyVZLXBfANkaI5C_Ipx8MAvppi-wEe1bEeU4QpKHhlK1kq83Flt6phBvmOVnuQEK-QxNXw; refresh_token=ext.a0.t00.v1.MYCCDxEL3kGKPkZI2-Im-u5k1qNpLSSi_YmtNPW25HYjW8QpUR0hYP4IJdZlVUwQsY4-iOJRpxxxW6H4WxvBFJ8; access_token_expires_at=1665115081; SU=jl3RchC4Y2dHNeprpyIMQ_RP3FmdGRAN7q49KpplI77ec6aW_fWNUM8RKlqBSVTgfLtLTz_P1XxN7Vb4dQgAS-fe4WMwNb2X371MqUdUmELon9eAW09_85MDcwGaM9eP; U=efe5032cba584b89daa28104442f34ee; forterToken=b4fcb06d79214546b80fff0da94b7d1f_1665113697524_853_UDF9_13ck; country_code=US; opt-user-profile=c37a0b417b2323ed38daeb452c8d0c1f62146390056040.34948491%252C21977090081%253A21964030107%252C21822802611%253A21858842388%252C21206601404%253A21221601920%252C21831241107%253A21779373108%252C22156681399%253A22176400606%252C21648720146%253A21685120556%252C22027151712%253A22030841005%252C21582730015%253A21585790242%252C21486340773%253A21477271605%252C22091660533%253A22076460901; CSID=1665115989846; _ga=GA1.2.1327924579.1665116546; _gid=GA1.2.1645929232.1665116546; IR_gbd=chegg.com; _cs_c=0; _gcl_au=1.1.609229599.1665116548; _fbp=fb.1.1665116548500.355877197; _tt_enable_cookie=1; _ttp=6d8561e6-2807-4954-95e8-0f06897cb476; _clck=k2c0jk|1|f5i|0; ab.storage.userId.b283d3f6-78a7-451c-8b93-d98cdb32f9f1=%7B%22g%22%3A%22a2d5b488-69f8-4a3c-94ac-62ce1886add1%22%2C%22c%22%3A1665116552783%2C%22l%22%3A1665116552794%7D; ab.storage.deviceId.b283d3f6-78a7-451c-8b93-d98cdb32f9f1=%7B%22g%22%3A%22e9e78319-01a3-4bc2-72ec-eb35b1e0cb85%22%2C%22c%22%3A1665116552800%2C%22l%22%3A1665116552800%7D; _iidt=yec1EN4ObDuIaHaofyLV3DKv6BZ/uGvm7FzrQeTvmTY0ZgdPActZCN9ut+lFzamElcIU6bZIZ/zR8Q==; _vid_t=l8D4gdrmeNie5eMzfipTPSmTqlrJlTX75WTlzcNI2hOv7Igf5co8aPxC6Fll+a2L3xllHoxAX3VCmQ==; DFID=web|a2eNQcxhFlYLtmDdvFTk; _pubcid=f3846083-2887-4bd9-b973-c95de241ce6b; __gads=ID=baf766655c8bd618:T=1665116531:S=ALNI_MaK3oK-KIpB71BXV8AbaYDDLPw2zg; __gpi=UID=000008d5237acc95:T=1665116531:RT=1665116531:S=ALNI_MZtKP3vHtboyYm9RftSPpYSJbMxOQ; optimizelyEndUserId=oeu1665116569727r0.3772015422916606; _scid=a7ae30f6-f852-4e3a-b2e8-8fbf24236363; _cs_cvars=%7B%221%22%3A%5B%22Page%20Name%22%2C%22question%20page%22%5D%7D; OptanonConsent=isIABGlobal=false&datestamp=Thu+Oct+06+2022+21%3A26%3A30+GMT-0700+(Pacific+Daylight+Time)&version=6.18.0&hosts=&consentId=a7998b8b-6f64-4a1e-ab97-4ea0d244f85b&interactionCount=1&landingPath=NotLandingPage&groups=snc%3A1%2Cfnc%3A1%2Cprf%3A1%2CSPD_BG%3A1%2Ctrg%3A1&AwaitingReconsent=false; _awl=2.1665116761.0.5-72f10b60fc748a2f8910598558187d9f-6763652d75732d7765737431-1; ab.storage.sessionId.b283d3f6-78a7-451c-8b93-d98cdb32f9f1=%7B%22g%22%3A%2214b1e835-8870-92fe-6c66-c9e1094633da%22%2C%22e%22%3A1665118591216%2C%22c%22%3A1665116552789%2C%22l%22%3A1665116791216%7D; _px3=63f5aeeeadb149c79c2d16f90170d2693d7d87a9dd41063226ffe0e992df7424:oxVVSDvls/FxvALNVXaJSx8C9KCzepCfl3JYlH9Q61YqDAp92/FUuRZgm6qR+bfD87YxzMToowShryHaplOl4A==:1000:mq3ijnJGK1NMp0eXWL1S9X5V25cx21ff6Kjyi7COFRNKtCqXNBMdg6nH9OhCJjtpc5cjwCCAKMZA4WBLfilRu0fKESptNCm1y87y928MYrbnEXq161BLMPmdRMKSP0N9replIFF51/xbCC59G22sqY4Mqr8cODWVYxQ/R2hHeU8cSXNPFTI7ufG2Lzt3VjxmjR/cU0tMfakUsrToZ2LswQ==; _px=oxVVSDvls/FxvALNVXaJSx8C9KCzepCfl3JYlH9Q61YqDAp92/FUuRZgm6qR+bfD87YxzMToowShryHaplOl4A==:1000:l1rY/0/BqX7KpoTbzrUi4KPlAZri//3YcrEQK9NhQLwsCTp/pC+0zP4V1MRuEx4p7i7aEbN15E0l6sZtQHZlUzKMgg31L8bMpd3iNv5ewOMWf9S8JpyodyF0tX00hq2Mcif3wrA3VzG1xDYG/wMpqdRDuWam2hCSuZaaDBNcuHo55hiZ6176FQG7BPJn8DW0HRNjFK+HdoMlsYxbhYwOIF2f55U8ReJl2igelY2uBZTdJpL244c1+g+IZf4yYWKClH5iGFqDI7ZXjGFtOniu/Q==; IR_14422=1665116812626%7C0%7C1665116812626%7C%7C; _gat=1; _uetsid=a6ee43e045f711edab3921c4797cbea0; _uetvid=a6eed47045f711edbb1be962b9d94dcc; _cs_id=e6157637-b504-a58d-8a30-838ccfa7c01f.1665116549.1.1665116819.1665116549.1.1699280549603; _cs_s=10.0.0.1665118619239; _clsk=16okwpk|1665116820101|9|0|e.clarity.ms/collect",
        Referer: "https://www.chegg.com/",
        "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393`,
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: `{"operationName":"QnaPageAnswer","variables":{"id":${id}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"bcbf649a6d9e0850ee15303538374d4cd7022bd80a3081d1b7ae3b029e5b09ca"}}}`,
      method: "POST",
    })
      .then((resp) => {
        return resp.json();
      })
      .then(async (data) => {
        console.log(data);
        const answers = data.data.questionByLegacyId.htmlAnswers;
        if (answers) {
          const attachments = answers.map((ans: any, index: number) => {
            console.log(ans);
            const html = <string>ans.answerData.html;
            const v1 = html.replaceAll(new RegExp("//", "gm"), "");
            const v2 = v1.replaceAll(new RegExp("https:", "gm"), "");
            const v3 = v2.replaceAll(new RegExp(`src="`, "gm"), `src="https://`);
            // html.replaceAll("src=\n//", "src=https://");
            console.log(v3);
            const buff = Buffer.from(v3);
            const att = new AttachmentBuilder(buff, { name: `solution${index + 1}.html`, description: `Solution to question` });
            return att;
          });
          if (attachments) {
            let texttosend = `✨**Solutions for question** ${url}\n`;
            for (let index = 0; index < attachments.length; index++) {
              texttosend += `📄 **Solution #${index + 1}** by ${answers[index].answerData.author.firstName} ${
                answers[index].answerData.author.lastName
              }\n`;
            }
            await interaction.user.send({ content: texttosend, files: attachments });
            await interaction.reply("**📩 The answer has been sent to your DMs!**");
          } else {
            await interaction.reply("Unable to retrieve information about the question.");
          }
        }
      });
  }
});

(async () => {
  await rest.put(Routes.applicationCommands(<string>process.env.CLIENTID), { body: commands });
})();
client.login(process.env.TOKEN);
