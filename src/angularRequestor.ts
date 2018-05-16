import { Requestor, AuthorizationServiceConfiguration } from "@openid/appauth";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";


export interface XhrSettings {
    url: string,
    dataType: string,
    method: "GET" | "POST",
    data: any,
    headers: any// {key : string, value: any}
}

@Injectable()
export class AngularRequestor extends Requestor {


    /**
     *
     */
    constructor(private httpClient: HttpClient) {
        super();

    }

    async xhr<T>(settings: any): Promise<T> {
        let url = settings.url;
        let dataType = settings.dataType;
        let method = settings.method;
        let data = settings.data;

        let response: Promise<T>;

        let options = {
            responseType: dataType,
            headers: settings.headers
        };

        if (settings.method == "GET") {
            response = this.httpClient.get<T>(url, options).toPromise();

        } else if (method == "POST") {
            response = this.httpClient.post<T>(url, data, options).toPromise();
        }

        return await response;
    }
}