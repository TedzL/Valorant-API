import { AxiosError } from "axios";

export class ValorantAPIError extends Error {
    status: number;
    statusText: string | undefined;
    code: string | undefined;
    ratelimits: { used: number, remaining: number, reset: number };
    url: string | undefined;

    constructor(i: AxiosError) {
        super();
        
        this.status = i.status ? i.status : (i.response ? i.response.status : 0);
        this.code = i.code;
        this.statusText = i.response?.statusText;
        this.ratelimits = { 
            used: Number(i.response?.headers['x-ratelimit-limit']),
            remaining: Number(i.response?.headers['x-ratelimit-remaining']),
            reset: Number(i.response?.headers['x-ratelimit-reset'])
        };
        this.url = i.config?.url;
    }
}