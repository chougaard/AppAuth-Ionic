import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@IonicPage()
@Component({
  selector: 'page-landing',
  templateUrl: 'landing.html',
})
export class LandingPage {
  accessToken: string;

  constructor(private authService: AuthServiceProvider) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LandingPage');
    this.accessToken = this.authService.getAccessTokenJson();
  }

  login(){
    this.authService.signin();
  }
}
