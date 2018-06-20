import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import 'rxjs/add/operator/first';
import { Observable } from 'rxjs/Observable';
import { HomePage } from '../home/home';

import { AuthProvider } from './../../providers/auth/auth.provider';
import { UserProvider } from './../../providers/user/user.provider';

/**
 * Generated class for the CadastroPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {

  cadastroForm: FormGroup;
  idOnesignal:string;
  pushOnesginal:string;
  listaSetores:Observable<any>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private formBuilder: FormBuilder,    
    private userProvider:UserProvider,
    private authProvier:AuthProvider
  ) {

    this.cadastroForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CadastroPage');
  }

  register() {
    let user = this.cadastroForm.value;
    let loading =  this.showLoading();
    this.userProvider.userExists(user.username)
    .first()
    .subscribe((userExists:Boolean)=>{
      if(!userExists){
        this.authProvier.createAuthUser(user.email,user.password).then((authState:any)=>{
          delete user.password;
          user.photo = 'assets/imgs/no-photo.jpg';
          user.onesignal = '';
          user.pushonesignal = '';
          this.userProvider.createUser(user,authState.uid).then(()=>{
            this.showAlert('Registro efetuado');
            this.navCtrl.setRoot(HomePage);
            loading.dismiss();
          }).catch((error:any)=>{
            console.log(error);
            loading.dismiss();
            this.showAlert(error);
          });
        }).catch((error:any)=>{
          console.log(error);
          loading.dismiss();
          this.showAlert(error);
        });
      }else{
        this.showAlert('O username '+user.username+' Já está sendo usado');
        loading.dismiss();
      }
    });
  }

  private showLoading(): Loading {
    let loading: Loading = this.loadingCtrl.create({
      content: "Please wait...",
    });
    loading.present();
    return loading;
  }

  private showAlert(message: string): void {
    this.alertCtrl.create({
      message: message,
      buttons: ['OK']
    }).present();
  }

}
