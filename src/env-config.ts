const API_HOST_LOCAL = 'localhost:8082';
const API_HOST_TEST = '139.59.25.205:8082';
const API_HOST_PROD = '139.59.25.205:8082';

const UI_HOST_LOCAL = 'localhost:3000';
const UI_HOST_TEST = 'localhost:3001';
const UI_HOST_PROD = 'retro.bemyaficionado.com';

const PROTOCOL = "http://";
const HOST_NAMES:Map<string,string> = new Map<string,string>();
HOST_NAMES.set(UI_HOST_LOCAL, API_HOST_LOCAL);
HOST_NAMES.set(UI_HOST_TEST, API_HOST_TEST);
HOST_NAMES.set(UI_HOST_PROD, API_HOST_PROD);

let host = window.location.host;
// @ts-ignore
export const SERVICE_URL = PROTOCOL + HOST_NAMES.get(host); // hostname:port

console.log("SERVICE_URL: ", SERVICE_URL);
