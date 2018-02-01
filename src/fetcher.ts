import _ = require("lodash");
const UNAUTHORIZED_ERR_CODE = 401;

export default class ApiRequest {

    constructor(baseUrl, defaultTimeout = 60000) {
        this.baseUrl = baseUrl;
        this.defaultTimeout = defaultTimeout;
    }

    baseUrl;
    defaultTimeout

    private async doRequest(apiEndpoint: string, requestObj?: RequestInit, timeout: number = this.defaultTimeout) {
        try {
            let timeoutObj = setTimeout(() => { throw new Error("Request timed out.") }, timeout);

            const handelResponse = async (response) => {
                clearTimeout(timeoutObj);

                if (response.ok) {

                    // support application/json or application/force-download (file) responses:
                    if (response.headers.get("Content-Type") === "application/force-download") {
                        return response.blob().then(blob => {
                            this.saveBlobToFile(blob);
                            return;
                        });
                    }
                    else
                        return response.json();
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

            const options = { ...requestObj, credentials: "include" } as RequestInit;

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

    public get(apiEndpoint: string, params?: any, timeout: number = this.defaultTimeout) {

        let paramsString = _.map(params, (value: string, key) => {
            return key + "=" + encodeURIComponent(value);
        }).join("&");

        const endpoint = this.baseUrl + apiEndpoint + (paramsString ? `?${paramsString}` : "");
        return this.doRequest(endpoint, undefined, timeout);
    }

    public post(apiEndpoint: string, params?: any, timeout: number = this.defaultTimeout) {

        const endpoint = this.baseUrl + apiEndpoint;

        const requestObj: RequestInit = {
            method: "POST",
            body: JSON.stringify(params),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        };
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