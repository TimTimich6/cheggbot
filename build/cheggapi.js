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
exports.finalreq = exports.secondReq = exports.firstReq = exports.agent = void 0;
const node_fetch_1 = __importDefault(require("node-fetch"));
const https_proxy_agent_1 = require("https-proxy-agent");
const proxy = "http://zabra:oYpVV4prBZUtwAS3@proxy.packetstream.io:31112";
exports.agent = new https_proxy_agent_1.HttpsProxyAgent(proxy);
function firstReq(url, config) {
    return __awaiter(this, void 0, void 0, function* () {
        yield (0, node_fetch_1.default)("https://www.chegg.com/_ajax/global/init", {
            headers: {
                accept: "application/json",
                "accept-language": "en-US,en;q=0.9,es;q=0.8",
                "content-type": "application/x-www-form-urlencoded",
                newrelic: "eyJ2IjpbMCwxXSwiZCI6eyJ0eSI6IkJyb3dzZXIiLCJhYyI6IjUwMTM1NiIsImFwIjoiMTAwMzE2MTE2MiIsImlkIjoiYTAwNjcyZTljMWI5MDk0MiIsInRyIjoiOWRlMjZkNmQxNTIwOTAxZmU1NDk3OGRjZmY4ODIzYzAiLCJ0aSI6MTY2NTM2MjE4NDM0NiwidGsiOiI2NTM2NiJ9fQ==",
                "sec-ch-ua": '"Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": '"Windows"',
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
                "User-Agent": config.UA,
                cookie: config.cookie,
                Referer: url,
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
            body: undefined,
            method: "GET",
            // agent,
        });
    });
}
exports.firstReq = firstReq;
function secondReq(url, config) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(config.auth);
        yield (0, node_fetch_1.default)("https://gateway.chegg.com/one-graph/graphql", {
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
                "x-chegg-referrer": url,
                cookie: config.cookie,
                Referer: "https://www.chegg.com/",
                "User-Agent": config.UA,
                "Referrer-Policy": "strict-origin-when-cross-origin",
            },
            body: `{"operationName":"DigitalOrderLineItems","variables":{},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"${config.sha1}"}}}`,
            method: "POST",
            // agent,
        });
    });
}
exports.secondReq = secondReq;
function finalreq(url, id, config) {
    console.log(config.auth);
    return (0, node_fetch_1.default)("https://gateway.chegg.com/one-graph/graphql", {
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
            "user-agent": config.UA,
            "x-chegg-referrer": url,
            cookie: config.cookie,
            Referer: "https://www.chegg.com",
        },
        body: `{"operationName":"QnaPageAnswer","variables":{"id":${id}},"extensions":{"persistedQuery":{"version":1,"sha256Hash":"${config.sha2}"}}}`,
        method: "POST",
        agent: exports.agent,
    });
}
exports.finalreq = finalreq;
