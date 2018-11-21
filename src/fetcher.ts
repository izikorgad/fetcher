import _ = require("lodash");

const UNAUTHORIZED_ERR_CODE = 401;
const DEFAULT_TIMEOUT = 60000;

export interface FetcherConfig {
    baseUrl: string;
    defaultTimeout?: number;
    credentialsMode?: RequestCredentials;
    defaultHeaders?: {};
}

export class Fetcher {

    constructor(config: FetcherConfig) {
        const { baseUrl, defaultTimeout, credentialsMode, defaultHeaders } = config;
        this.baseUrl = baseUrl;
        this.defaultTimeout = defaultTimeout || DEFAULT_TIMEOUT;
        this.defaultHeaders = defaultHeaders;
        this.credentialsMode = credentialsMode;
    }

    private baseUrl;
    private defaultTimeout;
    private defaultHeaders;
    private credentialsMode: RequestCredentials;

    /**
     * Send GET REST API call
     * @param apiEndpoint 
     * @param params 
     * @param timeout 
     */
    public get(apiEndpoint: string, params?: any, timeout: number = this.defaultTimeout, headers?) {

        let paramsString = _.map(params, (value: string, key) => {
            return key + "=" + encodeURIComponent(value);
        }).join("&");

        const endpoint = this.baseUrl + apiEndpoint + (paramsString ? `?${paramsString}` : "");

        const requestObj: RequestInit = !headers && !this.defaultHeaders ? undefined : {
            method: "GET",
            headers: !!this.defaultHeaders ? { ...this.defaultHeaders, ...(headers || {}) } : headers
        };
        return this.doRequest(endpoint, requestObj, timeout);
    }

    /**
     * Send POST REST API call
     * @param apiEndpoint 
     * @param params 
     * @param timeout 
     */
    public post(apiEndpoint: string, params?: any, timeout: number = this.defaultTimeout, headers?) {
        return this.callRestMethod(apiEndpoint, "POST", timeout, params);
    }

    /**
     * Send PUT REST API call
     * @param apiEndpoint 
     * @param params 
     * @param timeout 
     */
    public put(apiEndpoint: string, params?: any, timeout: number = this.defaultTimeout, headers?) {
        return this.callRestMethod(apiEndpoint, "PUT", timeout, params);
    }

    /**
     * Send PATCH REST API call
     * @param apiEndpoint 
     * @param params 
     * @param timeout 
     */
    public pathc(apiEndpoint: string, params?: any, timeout: number = this.defaultTimeout, headers?) {
        return this.callRestMethod(apiEndpoint, "PATCH", timeout, params);
    }

    /**
     * Send DELETE REST API call
     * @param apiEndpoint 
     * @param params 
     * @param timeout 
     */
    public delete(apiEndpoint: string, params?: any, timeout: number = this.defaultTimeout) {
        this.callRestMethod(apiEndpoint, "DELETE", timeout, params);
    }

    private async doRequest(apiEndpoint: string, requestObj?: RequestInit, timeout: number = this.defaultTimeout, headers?) {
        try {
            let timeoutObj = setTimeout(() => { throw new Error("Request timed out.") }, timeout);

            const handelResponse = async (response) => {
                clearTimeout(timeoutObj);

                if (response.ok) {

                    const contentType = response.headers.get("Content-Type");

                    // support application/json or application/force-download (file) responses:
                    if (contentType && contentType === "application/force-download") {
                        return response.blob().then(blob => {
                            this.saveBlobToFile(blob);
                            return;
                        });
                    }
                    else if (contentType && contentType.indexOf("application/json") > -1)
                        return await response.json();
                    else
                        return await response.text();
                }
                else {
                    const errMsg = await response.text();
                    const err = new Error(errMsg);
                    if (response.status === UNAUTHORIZED_ERR_CODE) {
                        err["code"] = UNAUTHORIZED_ERR_CODE;
                    }
                    throw err;
                }
            };

            let options;
            if (!!this.credentialsMode)
                options = { ...requestObj, credentials: this.credentialsMode } as RequestInit;
            else
                options = requestObj;

            const response = await fetch(apiEndpoint, options);

            const responseObject = await handelResponse(response);

            return responseObject;

        }
        catch (err) {
            let errMessage: string = (err.error && err.error.message ? err.error.message : err).toString();
            errMessage = this.normalizeError(errMessage);
            console.error(`Error in ${apiEndpoint} API:`, errMessage, err);
            throw new Error(errMessage);
        }
    }

    private callRestMethod(apiEndpoint, method: "POST" | "PUT" | "PATCH" | "DELETE", timeout, params?, headers?) {
        const endpoint = this.baseUrl + apiEndpoint;

        const requestObj: RequestInit = {
            method: method,
            body: JSON.stringify(params),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };

        if (!!headers) {
            requestObj.headers = !!this.defaultHeaders ? { ...this.defaultHeaders, ...this.defaultHeaders, ...headers } : { ...requestObj.headers, ...headers };
        }

        console.debug(endpoint, requestObj);
        return this.doRequest(endpoint, requestObj, timeout);
    }

    private saveBlobToFile(blob) {
        const url = window.URL.createObjectURL(blob);

        let a = document.createElement("a");
        a.style.display = "none";
        a.href = url;
        a.download = "";

        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // On Edge, revokeObjectURL should be called only after a.click() has completed, at least on EdgeHTML 15.15048:
        setTimeout(function () {
            window.URL.revokeObjectURL(url);
        }, 1000);
    }

    // Remove default 'Error:' prefix.
    private normalizeError(errMessage: string): string {
        if (errMessage.startsWith("Error:")) {
            errMessage = errMessage.substr(7);
            return this.normalizeError(errMessage);
        }
        else {
            return errMessage;
        }
    }


}