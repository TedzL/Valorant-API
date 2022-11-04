import { AxiosResponse } from "axios";

export class APIResponse {
    status: number;
    data: any;
    ratelimits: {
        used: number;
        remaining: number;
        reset: number;
    };
    url?: string;

    constructor(response: AxiosResponse) {
        this.status = response.status;
        this.data = response.data;
        this.ratelimits = {
            used: Number(response.headers['x-ratelimit-limit']),
            remaining: Number(response.headers['x-ratelimit-remaining']),
            reset: Number(response.headers['x-ratelimit-reset']),
        };
        this.url = response.config.url;
    }
}