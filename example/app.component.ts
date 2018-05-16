import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform } from 'ionic-angular';

import { FirstRunPage, SignInPage, MainPage, FrontPage } from '../pages/pages';
import { AuthService } from '../providers/user/auth.service';
//import { MainMenuPage } from '../pages/main-menu/main-menu';

@Component({
    selector: 'app-component',
    templateUrl: 'app.component.html'
})
export class MyApp {
    rootPage = "";

    @ViewChild(Nav) nav: Nav;

    constructor(
        private translate: TranslateService,
        private platform: Platform,
        private config: Config,
        private statusBar: StatusBar,
        private splashScreen: SplashScreen,
        private authService: AuthService
    ) {
        this.initApp();
    }

    initApp() {

        this.platform.ready().then(async () => {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.

            await this.authService.startupAsync(t => {
                //Register the callback for when authService has tried handling signin
                this.nav.setRoot(MainPage);
            });

            if (this.authService.isAuthenticated()) {
                //If we are already authenticated (ie has valid token in storage) we can just go ahead into the application
                this.rootPage = "MainMenuPage";
            } else {
                //This shows the signin/unauthorized page, because we are not signed in.
                //We could trigger the oidc signin instead
                this.rootPage = "SigninPage";
            }

            this.splashScreen.hide();

        });

        
    }

    // openPage(page) {
    //     // Reset the content nav to have just this page
    //     // we wouldn't want the back button to show in this scenario
    //     this.nav.setRoot(page.component);
    // }
}
