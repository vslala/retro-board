const API_HOST_LOCAL = 'http://localhost:8082';
const API_HOST_TEST = 'http://139.59.25.205:8082';
const API_HOST_PROD = 'http://139.59.25.205:8082';

const UI_HOST_LOCAL = 'localhost:3000';
const UI_HOST_TEST = 'localhost:3001';
const UI_HOST_PROD = '139.59.25.205';

const HOST_NAMES = {
    [UI_HOST_LOCAL]: API_HOST_LOCAL,
    [UI_HOST_TEST]: API_HOST_TEST,
    [UI_HOST_PROD]: API_HOST_PROD,
};

// @ts-ignore
export const SERVICE_URL = HOST_NAMES[window.location.hostname + ":" + window.location.port];
