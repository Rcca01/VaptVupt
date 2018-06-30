import { ChatProvider } from './../../providers/chat/chat';
import { Platform, AlertController, LoadingController, Loading } from 'ionic-angular';
import { Message } from './../../models/message.models';
import { Component, Input } from '@angular/core';


@Component({
  selector: 'box-message',
  templateUrl: 'box-message.html',
  host:{
    '[style.justify-content]':'((sendFor) ? "flex-start" : "flex-end")',
    '[style.text-align]':'((sendFor) ? "left" : "right")'
  }
})
export class BoxMessageComponent {

  @Input() sendMessage:Message;
  @Input() sendFor:Boolean;
  @Input() upload:number = 0;

  constructor(
    public platform: Platform,
    private chatProvider:ChatProvider,
    private alertCtrl: AlertController,
    private loadingCtrl:LoadingController
  ) {}  

  private showLoading(texto:string):Loading{
    let loading:Loading = this.loadingCtrl.create({
      content:texto,
    });
    loading.present();
    return loading;
  }

  presentAlert(texto:string) {
    let alert = this.alertCtrl.create({
      title: texto,
      subTitle: '10% of battery remaining',
      buttons: ['Dismiss']
    });
    alert.present();
  }

}
