import { cryptoGenerateRandom, RandomGenerator } from "@openid/appauth/built/crypto_utils";



export interface EndSessionRequestJson {
  idTokenHint: string;
  postLogoutRedirectURI: string;
  state?: string;
}

const BYTES_LENGTH = 10;
const newState = function(generateRandom: RandomGenerator): string {
  return generateRandom(BYTES_LENGTH);
};

export class EndSessionRequest {

  state: string;

  constructor(
    public idTokenHint: string,
    public postLogoutRedirectURI: string,
    state?: string,
    generateRandom = cryptoGenerateRandom) {
      this.state = state || newState(generateRandom);
    }

  toJson(): EndSessionRequestJson {
    let json: EndSessionRequestJson = {idTokenHint: this.idTokenHint, postLogoutRedirectURI : this.postLogoutRedirectURI };

    if (this.state) {
      json['state'] = this.state;
    }

    return json;
  }

  static fromJson(input: EndSessionRequestJson): EndSessionRequest {
    return new EndSessionRequest(
        input.idTokenHint, input.postLogoutRedirectURI, input.state);
  }
}
