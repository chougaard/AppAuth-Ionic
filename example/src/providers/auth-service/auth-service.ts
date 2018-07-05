import { EndSessionRequest } from './app-auth/endSessionRequest';
import { IonicEndSessionHandler } from './app-auth/ionicEndSessionRequestHandler';
import { Injectable } from '@angular/core';
import { IonicAuthorizationServiceConfiguration } from './app-auth/IonicAuthorizationServiceConfiguration';
import { AngularRequestor } from './app-auth/angularRequestor';
import { IonicAuthorizationRequestHandler, AUTHORIZATION_RESPONSE_KEY } from './app-auth/ionicAuthorizationRequestHandler';
import {
    AuthorizationNotifier,
    AuthorizationRequest,
    StorageBackend,
    LocalStorageBackend,
    BaseTokenRequestHandler,
    TokenRequest,
    GRANT_TYPE_AUTHORIZATION_CODE,
    GRANT_TYPE_REFRESH_TOKEN,
    AuthorizationServiceConfiguration,
    TokenResponse
} from '@openid/appauth';
import { IonicAppBrowserProvider } from './app-auth/ionicAppBrowser';
import { CodeVerifier } from './app-auth/codeVerifier';

//import { AppTokenResponse } from '../app-auth/AppTokenReponse';
const OpenIDConnectURL = "https://<URL FOR SERVER>";
const ClientId = "<CLIENT ID>";
const ClientSecret = "<SECRET>";
const RedirectUri = "<CUSTOM URL TYPE>://<CUSTOM URL PATH>";
const Scopes = "openid offline_access";
//URL Example: com.my.app://token
const EndSessionRedirectUri = "<CUSTOM URL TYPE>://<CUSTOM URL PATH";
//this should be different from redirectURI

//CONST values (magic strings):
const TOKEN_RESPONSE_KEY = "token_response";
const AUTH_CODE_KEY = "authorization_code";

const nowInSeconds = () => Math.round(new Date().getTime() / 1000);

@Injectable()
export class AuthServiceProvider {

    authCompletedReject: (reason?: any) => void;
    authCompletedResolve: (value?: boolean | PromiseLike<boolean>) => void;
    public authCompletedTask: Promise<boolean>;

    private authFinishedCallback: Function;
    private authLogOutCallback: Function;
    private discoveryTask: Promise<AuthorizationServiceConfiguration>;
    private tokenHandler: BaseTokenRequestHandler;
    private storageBackend: StorageBackend;
    private tokenResponse: TokenResponse;

    private code: string;

    private authorizationHandler: IonicAuthorizationRequestHandler;
    private endSessionHandler: IonicEndSessionHandler;
    private notifier: AuthorizationNotifier;

    private configuration: IonicAuthorizationServiceConfiguration;

    private codeVerifier: CodeVerifier = new CodeVerifier;




    constructor(private requestor: AngularRequestor, private ionicBrowserView: IonicAppBrowserProvider) {
        this.storageBackend = new LocalStorageBackend();
        this.fetchDiscovery(requestor);

        this.init();
    }

    private init() {
        this.notifier = new AuthorizationNotifier();
        // uses a redirect flow for authorization. This is part of the hybrid flow
        this.authorizationHandler = new IonicAuthorizationRequestHandler(this.ionicBrowserView);
        this.endSessionHandler = new IonicEndSessionHandler(this.ionicBrowserView);

        // set notifier to deliver responses
        this.authorizationHandler.setAuthorizationNotifier(this.notifier);

        this.notifier.setAuthorizationListener(async (request, response, error) => {
            console.log('Authorization request complete ', request, response, error);
            if (response) {
                await this.storageBackend.setItem(AUTH_CODE_KEY, response.code);
                this.code = response.code;
                await this.getTokensFlow();
            }
        });
    }

    private resetAuthCompletedPromise() {
        this.authCompletedTask = new Promise<boolean>((resolve, reject) => {
            this.authCompletedResolve = resolve;
            this.authCompletedReject = reject;
        });
    }

    private async getTokensFlow() {
        await this.requestAccessToken();

        if (this.isAuthenticated()) {
            this.authFinishedCallback()
        }
    }

    public async signin() {
        await this.discoveryTask;

        this.tryLoadTokenResponseAsync();

        try {
            if (this.tokenResponse && this.tokenResponse.isValid()) {
                this.requestWithRefreshToken();
                //called auth finished callback again to push back to main page 
                this.authFinishedCallback();
            } else {

                this.requestAuthorizationToken();
            }
        } catch (error) {
            this.authCompletedReject(error);
        }
    }

    public async startupAsync(signInCallback: Function, signOutCallback: Function) {

        this.authFinishedCallback = signInCallback;
        this.authLogOutCallback = signOutCallback;
        await this.tryLoadTokenResponseAsync();

    }

    public async AuthorizationCallback(url: string) {

        if ((url).indexOf(RedirectUri) === 0) {

            this.ionicBrowserView.CloseWindow();
            await this.storageBackend.setItem(AUTHORIZATION_RESPONSE_KEY, url);
            this.authorizationHandler.completeAuthorizationRequestIfPossible();

        }
        else if ((url).indexOf(EndSessionRedirectUri) === 0) {

            this.ionicBrowserView.CloseWindow();
            await this.storageBackend.clear();
            await this.resetAuthCompletedPromise();
            delete this.tokenResponse;

            this.authLogOutCallback();
        }
    }

    public async waitAuthenticated() {
        await this.authCompletedTask;

        if (this.tokenResponse.accessToken && this.tokenResponse.refreshToken) {
            if (this.shouldRefresh()) {
                //TODO: Refresh token
                await this.requestWithRefreshToken();
            }

            return this.isAuthenticated()
        } else {
            return false;
        }
    }

    public async signout() {
        await this.discoveryTask;

        let id_token = this.tokenResponse.idToken;
        let request = new EndSessionRequest(id_token, EndSessionRedirectUri);
        this.endSessionHandler.performEndSessionRequest(this.configuration, request);
    }

    private async requestAuthorizationToken() {

        this.resetAuthCompletedPromise();
        await this.discoveryTask;

        await this.codeVerifier.initialiseValues();

        //Redirect and signin to get the Authorization Token
        let request = new AuthorizationRequest(
            ClientId,
            RedirectUri,
            Scopes,
            AuthorizationRequest.RESPONSE_TYPE_CODE,
            undefined, /* state */
            {
                'access_type': 'offline',
                'code_challenge': this.codeVerifier.challenge,
                'code_challenge_method': this.codeVerifier.method,
                "client_secret": ClientSecret
            });

        this.authorizationHandler.performAuthorizationRequest(this.configuration, request);
    }

    private async requestAccessToken() {
        await this.discoveryTask;

        this.tokenHandler = new BaseTokenRequestHandler(this.requestor);

        let request: TokenRequest = null;

        if (this.code) {
            request = new TokenRequest(
                ClientId,
                RedirectUri,
                GRANT_TYPE_AUTHORIZATION_CODE,
                this.code,
                undefined,
                {
                    "client_secret": ClientSecret,
                    "code_verifier": this.codeVerifier.verifier
                }
            )

            let response = await this.tokenHandler.performTokenRequest(this.configuration, request)

            await this.saveTokenResponse(response);
            this.authCompletedResolve();
        }
    }

    public isAuthenticated() {
        var res = this.tokenResponse ? this.tokenResponse.isValid() : false;
        return res;
    }

    public shouldRefresh() {
        if (this.tokenResponse != null) {
            if (this.tokenResponse.expiresIn) {
                let now = nowInSeconds();
                let timeSinceIssued = now - this.tokenResponse.issuedAt;

                if (timeSinceIssued > this.tokenResponse.expiresIn / 2) {
                    return true;
                }

                return false;
            } else {
                return true;
            }
        }

        return true;
    }

    public getAuthorizationHeaderValue() {
        return this.tokenResponse && this.tokenResponse.isValid ? `${this.tokenResponse.tokenType} ${this.tokenResponse.accessToken}` : "";
    }

    public async requestWithRefreshToken() {
        this.resetAuthCompletedPromise();
        await this.discoveryTask;

        this.tokenHandler = new BaseTokenRequestHandler(this.requestor);

        let request: TokenRequest = null;

        if (this.tokenResponse) {
            request = new TokenRequest(
                ClientId,
                RedirectUri,
                GRANT_TYPE_REFRESH_TOKEN,
                undefined,
                this.tokenResponse.refreshToken,
                { "client_secret": ClientSecret }
            )

            let response = await this.tokenHandler.performTokenRequest(this.configuration, request);
            await this.saveTokenResponse(response);

            console.log("Trying to resolve authcompleted..");
            this.authCompletedResolve();
            console.log("Resolved authcompleted!");
        }
    }


    private async fetchDiscovery(requestor: AngularRequestor) {
        try {
            this.discoveryTask = IonicAuthorizationServiceConfiguration.fetchFromIssuer(OpenIDConnectURL, requestor)

            let response = await this.discoveryTask;
            this.configuration = response;

        } catch (error) {
            //If discovery doesn't work, this is the place to set the endpoints manually
            throw error;
        }
    }

    //UTILS:
    private async saveTokenResponse(response: TokenResponse) {
        this.tokenResponse = response;
        await this.storageBackend.setItem(TOKEN_RESPONSE_KEY, JSON.stringify(this.tokenResponse.toJson()));
    }

    private generateNonce(): string {
        return Math.floor(Math.random() * 100000).toString();
    }

    private async tryLoadTokenResponseAsync(): Promise<TokenResponse> {
        let item = await this.storageBackend.getItem(TOKEN_RESPONSE_KEY);

        if (item) {
            this.tokenResponse = TokenResponse.fromJson(JSON.parse(item));
        }

        return this.tokenResponse;
    }

    //test class only, dont have in actual app
    public getAccessTokenJson(): string {
        return JSON.stringify(this.tokenResponse);
    }
}