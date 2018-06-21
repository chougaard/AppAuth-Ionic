import { AuthorizationServiceConfiguration, AuthorizationServiceConfigurationJson } from "@openid/appauth";
import { AngularRequestor, XhrSettings } from "./angularRequestor";

/**
 * The standard base path for well-known resources on domains.
 * See https://tools.ietf.org/html/rfc5785 for more information.
 */
const WELL_KNOWN_PATH = '.well-known';

/**
 * The standard resource under the well known path at which an OpenID Connect
 * discovery document can be found under an issuer's base URI.
 */
const OPENID_CONFIGURATION = 'openid-configuration';

export class IonicAuthorizationServiceConfiguration extends AuthorizationServiceConfiguration {


    public static async fetchFromIssuer(openIdIssuerUrl: string, requestor: AngularRequestor): Promise<AuthorizationServiceConfiguration> {
        const fullUrl = `${openIdIssuerUrl}/${WELL_KNOWN_PATH}/${OPENID_CONFIGURATION}`;

        var xhrSettings = {
            url: fullUrl,
            dataType: "json",
            method: "GET"
        } as XhrSettings

        let json;

        try {        
            json = await requestor.xhr<AuthorizationServiceConfigurationJson>(xhrSettings)
        } catch (error) {
            console.log("Could not fetch xhr request", error);
        }
        return AuthorizationServiceConfiguration.fromJson(json);
    }

}