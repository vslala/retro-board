import axios, {AxiosRequestHeaders} from "axios";
import User from "./models/User";

const API_HOST_LOCAL = 'localhost:8082';
const API_INET_LOCAL = '192.168.1.6:8082';
const API_HOST_TEST = '139.59.25.205:8082';
const API_HOST_PROD = 'retro-service.bemyaficionado.com';

const UI_HOST_LOCAL = 'localhost:3000';
const UI_INET_LOCAL = '192.168.1.6:3000';
const UI_HOST_TEST = 'localhost:3001';
const UI_HOST_PROD = 'retro.bemyaficionado.com';
const UI_HOST_GITHUB = 'vslala.github.io';

const PROTOCOL = window.location.protocol + "//";
const HOST_NAMES:Map<string,string> = new Map<string,string>();
HOST_NAMES.set(UI_HOST_LOCAL, API_HOST_LOCAL);
HOST_NAMES.set(UI_INET_LOCAL, API_INET_LOCAL);
HOST_NAMES.set(UI_HOST_TEST, API_HOST_TEST);
HOST_NAMES.set(UI_HOST_PROD, API_HOST_PROD);
HOST_NAMES.set(UI_HOST_GITHUB, API_HOST_PROD);

let host = window.location.host;

export const SERVICE_URL = PROTOCOL + HOST_NAMES.get(host); // hostname:port

console.log("SERVICE_URL: ", SERVICE_URL);

export const request = axios.create({
    baseURL: SERVICE_URL
});

request.interceptors.request.use((config) => {
    config.headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem(User.ID_TOKEN)!}`,
        'Accept': '*/*'
    } as AxiosRequestHeaders
    return config;
});
