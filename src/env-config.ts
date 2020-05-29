const API_HOST_LOCAL = 'http://localhost:8082';
const API_HOST_TEST = 'http://139.59.25.205:8082';
const API_HOST_PROD = 'http://139.59.25.205:8082';

const UI_HOST_LOCAL = 'localhost:3000';
const UI_HOST_TEST = 'localhost:3001';
const UI_HOST_PROD = 'retro.bemyaficionado.com';

const HOST_NAMES = {
    [UI_HOST_LOCAL]: API_HOST_LOCAL,
    [UI_HOST_TEST]: API_HOST_TEST,
    [UI_HOST_PROD]: API_HOST_PROD,
};

let host = window.location.host;
let port = "";
if (window.location.port)
    port = ":" + window.location.port
// @ts-ignore
export const SERVICE_URL = HOST_NAMES[host + port];
