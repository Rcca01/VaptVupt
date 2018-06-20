import { AuthProvider } from './../../providers/auth/auth.provider';
import { AlertController, App, MenuController } from 'ionic-angular';
import { Component } from '@angular/core';
import { BaseComponent } from '../base.component';
import { Input } from '@angular/core';
import { User } from '../../models/user.models';

/**
 * Generated class for the ModifyLoggedHeaderComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'modify-logged-header',
  templateUrl: 'modify-logged-header.html'
})

export class ModifyLoggedHeaderComponent extends BaseComponent {

  @Input() title: string;
  @Input() user:User;

  constructor(
    public alertCtrl:AlertController,
    public authProvider:AuthProvider,
    public app:App,
    public menuCtrl:MenuController,) {
    super(alertCtrl,authProvider,app,menuCtrl);
  }

}