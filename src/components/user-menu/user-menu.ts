import { Component, Input } from '@angular/core';
import { BaseComponent } from '../base.component';
import { AlertController, App, MenuController } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.provider';
import { User } from '../../models/user.models';
import { PerfilPage } from '../../pages/perfil/perfil';

@Component({
  selector: 'user-menu',
  templateUrl: 'user-menu.html'
})
export class UserMenuComponent extends BaseComponent{

  @Input('user') currentUser:User;
  
  constructor(
    public alertCtrl:AlertController,
    public authProvider:AuthProvider,
    public app:App,
    public menuCtrl:MenuController,
  ) {
    super(alertCtrl,authProvider,app,menuCtrl);
  }

  onProfile():void{
    this.navCtrl.push(PerfilPage);
  }

}
