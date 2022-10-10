import fetch from "node-fetch";
export async function firstReq(url: string, config: any) {
  await fetch("https://www.chegg.com/_ajax/global/init", {
    headers: {
      accept: "application/json",
      "accept-language": "en-US,en;q=0.9,es;q=0.8",
      "content-type": "application/x-www-form-urlencoded",
      newrelic:
        "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjUwMTM1NiIsImFwIjoiMTAwMzE2MTE2MiIsImlkIjoiYTAwNjcyZTljMWI5MDk0MiIsInRyIjoiOWRlMjZkNmQxNTIwOTAxZmU1NDk3OGRjZmY4ODIzYzAiLCJ0aSI6MTY2NTM2MjE4NDM0NiwidGsiOiI2NTM2NiJ9fQ==",
      "sec-ch-ua": '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "User-Agent": config.UA,
      cookie: config.cookie,
      Referer: <string>url,
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: undefined,
    method: "GET",
  });
}
export async function secondReq(url: string, config: any) {
  console.log(config.auth);

  await fetch("https://gateway.chegg.com/one-graph/graphql", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,es;q=0.8",
      "apollographql-client-name": "chegg-web",
      "apollographql-client-version": "main-50430f42-3139728262",
      authorization: `Basic ${config.auth}`,
      "content-type": "application/json",
      "sec-ch-ua": '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "x-chegg-referrer": <string>url,
      cookie: config.cookie,
      Referer: "https://www.chegg.com/",
      "User-Agent": config.UA,
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: '{"operationName":"DigitalOrderLineItems","variables":{},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"d16d870021b064e94ccbd61e8de028c9636e8ce7e9435f60991f0dc0e89f1bfd"}}}',
    method: "POST",
  });
}
export function finalreq(url: string, id: string, config: any) {
  console.log(config.auth);

  return fetch("https://gateway.chegg.com/one-graph/graphql", {
    headers: {
      accept: "*/*",
      "accept-language": "en-US,en;q=0.9,es;q=0.8",
      "apollographql-client-name": "chegg-web",
      "apollographql-client-version": "main-a21cd9ba-3144690516",
      authorization: `Basic ${config.auth}`,
      "content-type": "application/json",
      "sec-ch-ua": '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-site",
      "User-Agent": config.UA,
      "x-chegg-referrer": <string>url,
      cookie: config.cookie,
      Referer: "https://www.chegg.com",
      "Referrer-Policy": "strict-origin-when-cross-origin",
    },
    body: `{"operationName":"QnaPageAnswer","variables":{"id":${id}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"bcbf649a6d9e0850ee15303538374d4cd7022bd80a3081d1b7ae3b029e5b09ca"}}}`,
    method: "POST",
  });
}