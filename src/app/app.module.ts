import { PerfilPage } from './../pages/perfil/perfil';
import { OneSignal } from '@ionic-native/onesignal';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { UserProvider } from '../providers/user/user.provider';
import { AuthProvider } from '../providers/auth/auth.provider';
import { BaseProvider } from '../providers/base/base.provider';
import { LoginPage } from '../pages/login/login';
import { CadastroPage } from '../pages/cadastro/cadastro';
import { ModifyLoggedHeaderComponent } from '../components/modify-logged-header/modify-logged-header';
import { CapitalizePipe } from '../pipes/capitalize/capitalize.pipe';
import { UserMenuComponent } from '../components/user-menu/user-menu';
import { UserInfoComponent } from '../components/user-info/user-info';
import { ProgressBarComponent } from '../components/progress-bar/progress-bar';

var config = {
  apiKey: "AIzaSyARcvkxhjma2xuT_8vDLaLvUUm6RnApqFg",
  authDomain: "vaptvupt-fb798.firebaseapp.com",
  databaseURL: "https://vaptvupt-fb798.firebaseio.com",
  projectId: "vaptvupt-fb798",
  storageBucket: "vaptvupt-fb798.appspot.com",
  messagingSenderId: "17835233535"
};

@NgModule({
  declarations: [
    CapitalizePipe,
    MyApp,
    ModifyLoggedHeaderComponent,
    UserMenuComponent,
    UserInfoComponent,    
    ProgressBarComponent,
    HomePage,
    LoginPage,
    CadastroPage,
    PerfilPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(config),
    AngularFirestoreModule.enablePersistence()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    CadastroPage,
    PerfilPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    UserProvider,
    BaseProvider,
    AuthProvider,
    AngularFireAuth,
    OneSignal
  ]
})
export class AppModule {}
