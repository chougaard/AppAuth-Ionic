// import { TokenResponse, TokenResponseJson } from "@openid/appauth";

// const nowInSeconds = () => Math.round(new Date().getTime() / 1000);

// export class AppTokenResponse extends TokenResponse {


//     public shouldRefresh() {
//         if (this.expiresIn) {
//             let now = nowInSeconds();
//             console.log(now);
//             let diff = now - this.issuedAt;
//             console.log(diff);
//             if (diff > this.expiresIn / 2) {
//                 debugger;
//                 return true;
//             }
//             debugger;
//             return false;
//         } else {
//             return true;
//         }
//     }

//     static fromJson(input: TokenResponseJson): AppTokenResponse {
//         return <AppTokenResponse>super.fromJson(input);
//     }
// }