import { SafariViewController, SafariViewControllerOptions } from '@ionic-native/safari-view-controller';
import { Injectable } from '@angular/core';
import { InAppBrowserObject, InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';

@Injectable()
export class IonicAppBrowserProvider {

  private inAppLogin: InAppBrowserObject;

    constructor(private inAppBrowser: InAppBrowser, private safariViewController: SafariViewController){ }

    public async ShowWindow(url: string): Promise<any>{
        if (await this.safariViewController.isAvailable()) {

            let optionSafari: SafariViewControllerOptions = {
                url: url,
                enterReaderModeIfAvailable: true,               
            }
            await this.safariViewController.show(optionSafari).toPromise();

        }else{
            let options: InAppBrowserOptions = {
                location: 'no',
                zoom: 'no',
                clearcache: 'yes',
                clearsessioncache: 'yes'
            }

            this.inAppLogin = this.inAppBrowser.create(url, '_self', options);

            await this.inAppLogin.show();
        }
    }

    public async CloseWindow(){
        if(await this.safariViewController.isAvailable()){
            this.safariViewController.hide();             
        }  else{
            this.inAppLogin.close(); 
        }
    }

}
