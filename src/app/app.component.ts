import { Component, ViewChild } from '@angular/core';
import { Platform, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { AngularFireAuth } from 'angularfire2/auth';
import { LoginPage } from '../pages/login/login';
import { OneSignal } from '@ionic-native/onesignal';

@Component({
  templateUrl: 'app.html'
})

export class MyApp {
  
  @ViewChild(Nav) nav: Nav;
  rootPage:any = HomePage;
  
  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    afAuth:AngularFireAuth,
    private oneSignal: OneSignal,
  ) {

    afAuth.authState.subscribe((user)=>{
      if(user){
        this.rootPage = HomePage;
      }else{
        this.rootPage = LoginPage;
      }
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.oneSignal.startInit('c1d8a7e9-18ca-4f96-b492-c7d73b02244a','547893958737');
      this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.None);
      this.oneSignal.handleNotificationReceived().subscribe(()=>{
        console.log('Notificação recebida');
      });
      this.oneSignal.handleNotificationOpened().subscribe(()=>{
        console.log('Notificação aberta');
      });
      this.oneSignal.endInit();
    });
  }
}

