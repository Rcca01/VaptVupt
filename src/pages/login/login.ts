import { AuthProvider } from './../../providers/auth/auth.provider';
import { CadastroPage } from './../cadastro/cadastro';
import { HomePage } from './../home/home';
import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { OneSignal } from '@ionic-native/onesignal';
import { UserProvider } from '../../providers/user/user.provider';

import * as firebase from 'firebase';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  loginForm:FormGroup;
  user:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController,
    private formBuilder:FormBuilder,
    private authProvider:AuthProvider,
    private userProvider:UserProvider,
    private oneSignal: OneSignal
  ) {
    this.loginForm = this.formBuilder.group({
      email:['',[Validators.required]],
      password:['',[Validators.required, Validators.minLength(6)]],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(){
    let loading:Loading = this.showLoading();
    this.authProvider.signIn(this.loginForm.value.email,this.loginForm.value.password).then((user)=>{
      this.oneSignal.getIds().then((ids)=>{
        this.userProvider.getDadosUserObject(user.uid)
        .update({onesignal:ids.userId,pushonesignal:ids.pushToken}).then(()=>{          
          this.user = user;
          loading.dismiss();
          this.navCtrl.setRoot(HomePage,{
            usuario:this.user
          });
        }).catch();
      });
      loading.dismiss();
    }).catch((error:any)=>{
      console.log(error);
      loading.dismiss();
      this.showAlert(error);
    })
  }

  private showLoading():Loading{
    let loading:Loading = this.loadingCtrl.create({
      content:"Please wait...",
    });
    loading.present();
    return loading;
  }

  private showAlert(message:string):void{
    this.alertCtrl.create({
      message:message,
      buttons:['OK']
    }).present();
  }

  cadastro(){
    this.navCtrl.push(CadastroPage);
  }
}