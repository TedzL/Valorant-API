import axios, { AxiosError, AxiosResponse } from "axios";

export class ValorantAPI {
    key: string | undefined;
    baseURL = 'https://api.henrikdev.xyz/valorant';

    constructor(key?: string) {
        this.key = key;
    }

    private _parseresponse(response: AxiosResponse) {
        return {
            status: response.status,
            data: response.data,
            ratelimits: {
                used: Number(response.headers['x-ratelimit-limit']),
                remaining: Number(response.headers['x-ratelimit-remaining']),
                reset: Number(response.headers['x-ratelimit-reset']),
            },
            url: response.config.url,
        };
    }

    private async _request(info: { endpoint: string, rType?: any, params?: {} }) {
        const response = await axios.get(this.baseURL+info.endpoint, {
            url: this.baseURL+info.endpoint,
            responseType: info.rType ? info.rType : 'json',
            headers: this.key ? { Authorization: this.key, } : undefined,
            params: info.params ? info.params : undefined
        }).catch(err => err);

        if (!(response instanceof AxiosError)) return this._parseresponse(response);
        else {
            throw new ValorantAPIError(response);
        }
    }

    getAccount(info: { name: string, tag: string }) {
        return this._request({
            endpoint: `/v1/account/${info.name}/${info.tag}`
        });
    }

    getContent(info: { locale: string }) {
        return this._request({
            endpoint: `/v1/content`, 
            params: { locale: info.locale }
        });
    }

    getCrosshair(info: { id: string }) {
        return this._request({
            endpoint: `/v1/crosshair/generate`, 
            params: { id: info.id }
        });
    }

    getLeaderboard(info: { region: 'eu' | 'na' | 'ap' | 'kr' | 'latam' | 'br', start?: string, nameTag?: { name: string, tag: string }, season?: 'e5a3' | 'e5a2' | 'e5a1' | 'e4a3' | 'e4a2' | 'e4a1' | 'e3a3' | 'e3a2' | 'e3a1' | 'e2a3' | 'e2a2' | 'e2a1' }) {
        let dynamicParams: any = {};
        dynamicParams.start = info.start ? info.start : undefined;
        dynamicParams.name = info.nameTag ? info.nameTag.name : undefined;
        dynamicParams.tag = info.nameTag ? info.nameTag.tag : undefined;
        dynamicParams.season = info.season ? info.season : undefined;
        
        return this._request({
            endpoint: `/v2/leaderboard/${info.region}`, 
            params: dynamicParams
        });
    }

    getMatch(info: { id: string }) {
        return this._request({
            endpoint: `/v2/match/${info.id}`,
        });
    }

    getMatches(info: { region: 'eu' | 'na' | 'ap' | 'kr' | 'latam' | 'br', name: string, tag: string }) {
        return this._request({
            endpoint: `/v3/matches/${info.region}/${info.name}/${info.tag}`,
        });
    }

    getMMRDetails(info: { region: 'eu' | 'na' | 'ap' | 'kr' | 'latam' | 'br', name: string, tag: string, season: string }) {
        return this._request({
            endpoint: `/v2/mmr/${info.region}/${info.name}/${info.tag}`,
        });
    }

    getMMRHistory(info: { region: 'eu' | 'na' | 'ap' | 'kr' | 'latam' | 'br', name: string, tag: string }) {
        return this._request({
            endpoint: `/v1/mmr-history/${info.region}/${info.name}/${info.tag}`,
        });
    }

    getServerStatus(info: { region: 'eu' | 'na' | 'ap' | 'kr' | 'latam' | 'br' }) {
        return this._request({
            endpoint: `/v1/status/${info.region}`,
        });
    }

    getStoreFeatured() {
        return this._request({
            endpoint: `/v2/store-featured`,
        });
    }

    getStoreOffers() {
        return this._request({
            endpoint: `/v1/store-offers`,
        });
    }

    getVersion(info: { region: 'eu' | 'na' | 'ap' | 'kr' | 'latam' | 'br' }) {
        return this._request({
            endpoint: `/v1/version/${info.region}`,
        });
    }

    getWebsite(info: { countryCode: string }) {
        return this._request({
            endpoint: `/v1/website/${info.countryCode}`,
        });
    }
    
}

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