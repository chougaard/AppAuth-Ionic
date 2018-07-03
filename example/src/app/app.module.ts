import { SafariViewController } from '@ionic-native/safari-view-controller';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { AngularRequestor } from '../providers/auth-service/app-auth/angularRequestor';
import { HttpClientModule } from '@angular/common/http';
import { IonicAppBrowserProvider } from '../providers/auth-service/app-auth/ionicAppBrowser';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@NgModule({
  declarations: [
    MyApp
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    AngularRequestor,
    IonicAppBrowserProvider,
    InAppBrowser,
    SafariViewController
  ]
})
export class AppModule {}
