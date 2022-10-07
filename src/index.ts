import { ApplicationCommandOptionWithChoicesAndAutocompleteMixin, Attachment, AttachmentBuilder, Client, REST, Routes } from "discord.js";
import dotenv from "dotenv";
import axios from "axios";
import fetch from "node-fetch";
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
    const url = interaction.options.getString("url");
    console.log("url:", url);

    const index = <number>url?.lastIndexOf("q") + 1;
    const id = url?.substring(index);
    console.log("id:", id);

    await fetch("https://www.chegg.com/_ajax/global/init", {
      headers: {
        accept: "application/json",
        "accept-language": "en-US,en;q=0.9,es;q=0.8",
        "content-type": "application/x-www-form-urlencoded",
        newrelic:
          "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjUwMTM1NiIsImFwIjoiMTAwMzE2MTE2MiIsImlkIjoiN2E1MTMxYzQxNmRjYmI1MSIsInRyIjoiODI5ZjAxNWI4MDAwNzc1NTM2NjJhOTZiMWYyNzg5N2UiLCJ0aSI6MTY2NTExNjgyMzg3MSwidGsiOiI2NTM2NiJ9fQ==",
        "sec-ch-ua": '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": '"Windows"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        traceparent: "00-829f015b800077553662a96b1f27897e-7a5131c416dcbb51-01",
        tracestate: "65366@nr=0-1-501356-1003161162-7a5131c416dcbb51----1665116823871",
        "User-Agent": `Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.79 Safari/537.36 Edge/14.14393`,
        cookie:
          "AMCV_3FE7CBC1556605A77F000101%40AdobeOrg=-408604571%7CMCIDTS%7C18837%7CMCMID%7C80357559670330189053311125690101883553%7CMCAID%7CNONE%7CMCOPTOUT-1627450396s%7CNONE%7CvVersion%7C4.6.0; usprivacy=1YNY; V=c37a0b417b2323ed38daeb452c8d0c1f62146390056040.34948491; C=0; O=0; OneTrustWPCCPAGoogleOptOut=false; exp=C026A; CVID=9efa4471-3b76-400f-9640-e26e71298e54; expkey=8427397BD30FCD57D82BA3551FE3E71E; CSessionID=19ab3a49-f73f-47c7-9a60-751bb5421c80; userData=%7B%22authStatus%22%3A%22Logged%20Out%22%2C%22attributes%22%3A%7B%22uvn%22%3A%22c37a0b417b2323ed38daeb452c8d0c1f62146390056040.34948491%22%7D%7D; mcid=80357559670330189053311125690101883553; PHPSESSID=qk9llmgbn5r7edi26bli9vcv3u; user_geo_location=%7B%22country_iso_code%22%3A%22US%22%2C%22country_name%22%3A%22United+States%22%2C%22region%22%3A%22CA%22%2C%22region_full%22%3A%22California%22%2C%22city_name%22%3A%22Rancho+Palos+Verdes%22%2C%22postal_code%22%3A%2290275%22%2C%22locale%22%3A%7B%22localeCode%22%3A%5B%22en-US%22%5D%7D%7D; pxcts=c4f0ae0e-45f0-11ed-b692-595369797142; _pxvid=c4f0a258-45f0-11ed-b692-595369797142; id_token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImRhdmlkbGxhbmRyeTFAZ21haWwuY29tIiwiaXNzIjoiaHViLmNoZWdnLmNvbSIsInN1YiI6ImEyZDViNDg4LTY5ZjgtNGEzYy05NGFjLTYyY2UxODg2YWRkMSIsImF1ZCI6IkNIR0ciLCJpYXQiOjE2NjUxMTM2NDEsImV4cCI6MTY4MDY2NTY0MSwicmVwYWNrZXJfaWQiOiJhcHcifQ.F31NVVvv7o_mNNIYGBV0IXHEZH5WYlk-Z0YbBzlagMyVKvANWe-7_2zm4SVvurpvDS1YQFghIFAOfZNR4FYzPhOJr1M9MuGzBcnj174LkJW7EIAXIS-YwKCHm40qnz5JrnhYjWgeZUIqD0rv1H1Q_-jkbxl7NkEfK0sB_2ymCDDdRqcUzgo2SSzCESfpWtQmbCcYX5iTdKj-WhyN9obtFdUl1A_jk1Bl1gr7JJPtt97mRP6i65J7ghUg9XOtrPq8bkn4WrkmtV-3_Sd_WyVZLXBfANkaI5C_Ipx8MAvppi-wEe1bEeU4QpKHhlK1kq83Flt6phBvmOVnuQEK-QxNXw; refresh_token=ext.a0.t00.v1.MYCCDxEL3kGKPkZI2-Im-u5k1qNpLSSi_YmtNPW25HYjW8QpUR0hYP4IJdZlVUwQsY4-iOJRpxxxW6H4WxvBFJ8; access_token_expires_at=1665115081; SU=jl3RchC4Y2dHNeprpyIMQ_RP3FmdGRAN7q49KpplI77ec6aW_fWNUM8RKlqBSVTgfLtLTz_P1XxN7Vb4dQgAS-fe4WMwNb2X371MqUdUmELon9eAW09_85MDcwGaM9eP; U=efe5032cba584b89daa28104442f34ee; _sdsat_cheggUserUUID=a2d5b488-69f8-4a3c-94ac-62ce1886add1; forterToken=b4fcb06d79214546b80fff0da94b7d1f_1665113697524_853_UDF9_13ck; country_code=US; opt-user-profile=c37a0b417b2323ed38daeb452c8d0c1f62146390056040.34948491%252C21977090081%253A21964030107%252C21822802611%253A21858842388%252C21206601404%253A21221601920%252C21831241107%253A21779373108%252C22156681399%253A22176400606%252C21648720146%253A21685120556%252C22027151712%253A22030841005%252C21582730015%253A21585790242%252C21486340773%253A21477271605%252C22091660533%253A22076460901; CSID=1665115989846; _omappvp=yUHtUNgdd0bAScQCB3Tu51jRB3tUWQTwED1DvjtgmScdcRu4JSm97fv6UvVvCw9VBNDeoLndxYICsaqxlHIDTGlljvlQsJKW; schoolapi=52f720d1-5f78-4b66-a65c-13938b30d62f|0.568421053; _ga=GA1.2.1327924579.1665116546; _gid=GA1.2.1645929232.1665116546; sa-user-id=s%253A0-a2493c23-99a1-42d2-7bb0-be830eb44dd3.dy%252FPGtKrmC4J%252B7D6r5ardK2uFrUr5kdkGrytLI0LQQ0; sa-user-id-v2=s%253A0-a2493c23-99a1-42d2-7bb0-be830eb44dd3%2524ip%252468.101.127.107.jauzf4PYgYRNA1hA08C8nQa7r668Cy3SscoHsmZ%252BLG4; IR_gbd=chegg.com; _cs_c=0; _gcl_au=1.1.609229599.1665116548; _fbp=fb.1.1665116548500.355877197; _tt_enable_cookie=1; _ttp=6d8561e6-2807-4954-95e8-0f06897cb476; _clck=k2c0jk|1|f5i|0; ab.storage.userId.b283d3f6-78a7-451c-8b93-d98cdb32f9f1=%7B%22g%22%3A%22a2d5b488-69f8-4a3c-94ac-62ce1886add1%22%2C%22c%22%3A1665116552783%2C%22l%22%3A1665116552794%7D; ab.storage.deviceId.b283d3f6-78a7-451c-8b93-d98cdb32f9f1=%7B%22g%22%3A%22e9e78319-01a3-4bc2-72ec-eb35b1e0cb85%22%2C%22c%22%3A1665116552800%2C%22l%22%3A1665116552800%7D; _iidt=yec1EN4ObDuIaHaofyLV3DKv6BZ/uGvm7FzrQeTvmTY0ZgdPActZCN9ut+lFzamElcIU6bZIZ/zR8Q==; _vid_t=l8D4gdrmeNie5eMzfipTPSmTqlrJlTX75WTlzcNI2hOv7Igf5co8aPxC6Fll+a2L3xllHoxAX3VCmQ==; DFID=web|a2eNQcxhFlYLtmDdvFTk; _pbjs_userid_consent_data=3524755945110770; _pubcid=f3846083-2887-4bd9-b973-c95de241ce6b; sbm_a_b_test=1-control; _lr_geo_location=US; _lr_env=eyJlbnZlbG9wZSI6IkFvRTEyVmI4cVBRMzh2UnZWSWk0REwwV2dUbVVlb09qZXRzYWxCa0dCdkhRQzItNXZTSzRnUmNlWS01dnpNODEwZW5lN05mcXJMakU5R2dBbUdqM2l0OGF5VjhvLVBmZXJUaG5QSXdsRkp4RHJkSGtHR2dUVGlkYzFXSl9fWC1jQnp0cUtPWkphZXIxcHNtY2lQVmNRNEpnOFREMXI5SjJLSms1ck5pTmFKdUhUaEU0RUl2Y1I4VHJRNC1nNWRXMnB1eFppM0lGN0xjQUk0TklRdUhubXNSby1Vc0J1d2FBMjZ2MHU4QVVNMUxaR3hSSGtvQTJtWUJZYUMwQnNvdFppVjhZT1NrUklpMkVUME94M0JLVVJ0QUJYVWNxXzhZYmVXMTlqSWdocGFJVUFZMGJRemxrYWxtaUtCMkNBd0dsQkRCTldjYkhKX3RSZ1BnTXpEa01zTVpUSEduQkMwZmZOU3J1Z3Q1ZE8yVFdQZ2VOQlZWTVRiUlRMaTRVeXBEYWFlczFmdUMzdGNmUzdpNW01MWpKOFBtcWlLNHFQVXJVWW5ZWmJtOGozSk56cW5TdW8yZGdHWmJMR003UDJyTXprTzZFdzQxSmNaeHBFMk9vUjVCN1M2Q0Jyb3J1akk4S2VEWXVQSHBuZUNPVUxBIiwidGltZXN0YW1wIjoxNjY1MTE2NTYxMDE5LCJ2ZXJzaW9uIjoiMS44LjEifQ%3D%3D; __gads=ID=baf766655c8bd618:T=1665116531:S=ALNI_MaK3oK-KIpB71BXV8AbaYDDLPw2zg; __gpi=UID=000008d5237acc95:T=1665116531:RT=1665116531:S=ALNI_MZtKP3vHtboyYm9RftSPpYSJbMxOQ; _lr_env_src_ats=true; idl_env=AoE12Vb8qPQ38vRvVIi4DL0WgTmUeoOjetsalBkGBvHQC2-5vSK4gRceY-5vzM810ene7NfqrLjE9GgAmGj3it8ayV8o-PferThnPIwlFJxDrdHkGGgTTidc1WJ__X-cBztqKOZJaer1psmciPVcQ4Jg8TD1r9J2KJk5rNiNaJuHThE4EIvcR8TrQ4-g5dW2puxZi3IF7LcAI4NIQuHnmsRo-UsBuwaA26v0u8AUM1LZGxRHkoA2mYBYaC0BsotZiV8YOSkRIi2ET0Ox3BKURtABXUcq_8YbeW19jIghpaIUAY0bQzlkalmiKB2CAwGlBDBNWcbHJ_tRgPgMzDkMsMZTHGnBC0ffNSrugt5dO2TWPgeNBVVMTbRTLi4UypDaaes1fuC3tcfS7i5m51jJ8PmqiK4qPUrUYnYZbm8j3JNzqnSuo2dgGZbLGM7P2rMzkO6Ew41JcZxpE2OoR5B7S6CBrorujI8KeDYuPHpneCOULA; connectid=%7B%22vmuid%22%3A%22P4TPaESOGDGQn87dCv3xcyhgZdUJVnSbqrGRIcIEz9ArKpzAAW7_dW3gig8bTtWE9bDqtDEA6IX29EdQbUCexw%22%2C%22connectid%22%3A%22P4TPaESOGDGQn87dCv3xcyhgZdUJVnSbqrGRIcIEz9ArKpzAAW7_dW3gig8bTtWE9bDqtDEA6IX29EdQbUCexw%22%2C%22ttl%22%3A24%7D; pbjs-unifiedid=%7B%22TDID%22%3A%22262f3834-149c-43c6-b2d3-301d4c714167%22%2C%22TDID_LOOKUP%22%3A%22TRUE%22%2C%22TDID_CREATED_AT%22%3A%222022-09-07T04%3A22%3A14%22%7D; optimizelyEndUserId=oeu1665116569727r0.3772015422916606; DFID=web|a2eNQcxhFlYLtmDdvFTk; _lr_sampling_rate=100; _sdsat_authState=Hard%20Logged%20In; _scid=a7ae30f6-f852-4e3a-b2e8-8fbf24236363; _cs_cvars=%7B%221%22%3A%5B%22Page%20Name%22%2C%22question%20page%22%5D%7D; _omappvs=1665116779849; OptanonConsent=isIABGlobal=false&datestamp=Thu+Oct+06+2022+21%3A26%3A30+GMT-0700+(Pacific+Daylight+Time)&version=6.18.0&hosts=&consentId=a7998b8b-6f64-4a1e-ab97-4ea0d244f85b&interactionCount=1&landingPath=NotLandingPage&groups=snc%3A1%2Cfnc%3A1%2Cprf%3A1%2CSPD_BG%3A1%2Ctrg%3A1&AwaitingReconsent=false; _awl=2.1665116761.0.5-72f10b60fc748a2f8910598558187d9f-6763652d75732d7765737431-1; ab.storage.sessionId.b283d3f6-78a7-451c-8b93-d98cdb32f9f1=%7B%22g%22%3A%2214b1e835-8870-92fe-6c66-c9e1094633da%22%2C%22e%22%3A1665118591216%2C%22c%22%3A1665116552789%2C%22l%22%3A1665116791216%7D; _px3=63f5aeeeadb149c79c2d16f90170d2693d7d87a9dd41063226ffe0e992df7424:oxVVSDvls/FxvALNVXaJSx8C9KCzepCfl3JYlH9Q61YqDAp92/FUuRZgm6qR+bfD87YxzMToowShryHaplOl4A==:1000:mq3ijnJGK1NMp0eXWL1S9X5V25cx21ff6Kjyi7COFRNKtCqXNBMdg6nH9OhCJjtpc5cjwCCAKMZA4WBLfilRu0fKESptNCm1y87y928MYrbnEXq161BLMPmdRMKSP0N9replIFF51/xbCC59G22sqY4Mqr8cODWVYxQ/R2hHeU8cSXNPFTI7ufG2Lzt3VjxmjR/cU0tMfakUsrToZ2LswQ==; _px=oxVVSDvls/FxvALNVXaJSx8C9KCzepCfl3JYlH9Q61YqDAp92/FUuRZgm6qR+bfD87YxzMToowShryHaplOl4A==:1000:l1rY/0/BqX7KpoTbzrUi4KPlAZri//3YcrEQK9NhQLwsCTp/pC+0zP4V1MRuEx4p7i7aEbN15E0l6sZtQHZlUzKMgg31L8bMpd3iNv5ewOMWf9S8JpyodyF0tX00hq2Mcif3wrA3VzG1xDYG/wMpqdRDuWam2hCSuZaaDBNcuHo55hiZ6176FQG7BPJn8DW0HRNjFK+HdoMlsYxbhYwOIF2f55U8ReJl2igelY2uBZTdJpL244c1+g+IZf4yYWKClH5iGFqDI7ZXjGFtOniu/Q==; _tq_id.TV-8145726354-1.ad8a=195396b4dbe98c01.1665116548.0.1665116813..; IR_14422=1665116812626%7C0%7C1665116812626%7C%7C; _gat=1; _uetsid=a6ee43e045f711edab3921c4797cbea0; _uetvid=a6eed47045f711edbb1be962b9d94dcc; _cs_id=e6157637-b504-a58d-8a30-838ccfa7c01f.1665116549.1.1665116819.1665116549.1.1699280549603; _cs_s=10.0.0.1665118619239; _clsk=16okwpk|1665116820101|9|0|e.clarity.ms/collect",
        Referer: <string>url,
        "Referrer-Policy": "strict-origin-when-cross-origin",
      },
      body: undefined,
      method: "GET",
    });
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
      body: '{"operationName":"DigitalOrderLineItems","variables":{},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"d16d870021b064e94ccbd61e8de028c9636e8ce7e9435f60991f0dc0e89f1bfd"}}}',
      method: "POST",
    });
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
            console.log(ans.answerData.html);

            const buff = Buffer.from(ans.answerData.html);
            const att = new AttachmentBuilder(buff, { name: `solution${index + 1}.html`, description: `Solution to question` });
            return att;
          });
          if (attachments) {
            console.log(attachments);

            await interaction.user.send({ files: attachments });
            await interaction.reply("The answer has been sent to your dms!");
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
