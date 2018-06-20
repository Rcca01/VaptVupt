import { LoginPage } from './../pages/login/login';
import { AlertController, App, MenuController, NavController } from "ionic-angular";

import { AuthProvider } from './../providers/auth/auth.provider';

import { OnInit } from "@angular/core";

export class BaseComponent implements OnInit{

    protected navCtrl:NavController;

    constructor(
        public alertCtrl:AlertController,
        public authProvider:AuthProvider,
        public app:App,
        public menuCtrl:MenuController,
    ) {}


    ngOnInit():void{
        this.navCtrl = this.app.getActiveNav();
    }

    onLogout(){
        this.alertCtrl.create({
            message:'Deseja realmente sair?',
            buttons:[
                {
                    text:'Yes',
                    handler:()=>{
                        this.authProvider.logout().then(()=>{
                            this.navCtrl.setRoot(LoginPage);
                            this.menuCtrl.enable(false,'user-menu');
                        });
                    }
                },
                {
                    text:'no'
                }
            ]
        }).present();
    }
}