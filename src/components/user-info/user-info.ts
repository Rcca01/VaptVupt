import { Component, Input } from '@angular/core';
import { User } from '../../models/user.models';

@Component({
  selector: 'user-info',
  templateUrl: 'user-info.html'
})
export class UserInfoComponent {

  @Input() user:User;
  @Input() isMenu:Boolean=false;

  constructor() {
  }

}
