import { EndSessionRequest } from './endSessionRequest';
import { AuthorizationServiceConfiguration, StringMap, BasicQueryStringUtils } from "@openid/appauth";
import { IonicAppBrowserProvider } from './ionicAppBrowser';

export class IonicEndSessionHandler {

    constructor(
        private ionicBrowserView: IonicAppBrowserProvider,
        private utils = new BasicQueryStringUtils()
    ) { }

    public async performEndSessionRequest(configuration: AuthorizationServiceConfiguration, request: EndSessionRequest): Promise<any> {

        //Build the request
        let url = this.buildRequestUrl(configuration, request);

        //Show in Browser Window
        await this.ionicBrowserView.ShowWindow(url);
    }

    private buildRequestUrl(
        configuration: AuthorizationServiceConfiguration,
        request: EndSessionRequest) {
        // build the query string
        // coerce to any type for convenience
        let requestMap: StringMap = {
            'id_token_hint': request.idTokenHint,
            'post_logout_redirect_uri': request.postLogoutRedirectURI,
            'state': request.state,
        };

        let query = this.utils.stringify(requestMap);
        let baseUrl = configuration.endSessionEndpoint;
        let url = `${baseUrl}?${query}`;
        return url;
    }
}
