import { Produto } from './../../models/produto.models';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { User } from '../../models/user.models';
import { Chat } from '../../models/chat.models';
import { ChatPage } from '../chat/chat';
import { AuthProvider } from '../../providers/auth/auth.provider';
import { UserProvider } from '../../providers/user/user.provider';
import { ChatProvider } from '../../providers/chat/chat';

import * as firebase from 'firebase';

@Component({
  selector: 'page-detalhes-produto',
  templateUrl: 'detalhes-produto.html',
})
export class DetalhesProdutoPage {

  produto:Produto;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public userProvider:UserProvider,
    public chatProvider:ChatProvider,
    private alertCtrl:AlertController
  ) {
  }

  ionViewDidLoad() {
    this.produto = this.navParams.get('prod');
  }

  onChatCreate(id:string){
    this.userProvider.getDadosUser(id).then((dono:firebase.firestore.DocumentSnapshot)=>{
      let donoProduto = <User>dono.data();
      donoProduto.id = id;
      this.authProvider.currentUserObservable
        .first()
        .subscribe((userLogged)=>{
          if(userLogged.uid != donoProduto.id){
            this.chatProvider.getLastMessage(userLogged.uid,donoProduto.id).then((dadosChat:firebase.firestore.DocumentSnapshot)=>{
              if(!dadosChat.exists){
                this.userProvider.getDadosUser(userLogged.uid).then((dadosUser:firebase.firestore.DocumentSnapshot)=>{
                  let infouser = <User>dadosUser.data();
                  let timestamp:Object = firebase.database.ServerValue.TIMESTAMP;
                  //Chat user logged
                  let chat1 = new Chat('',0,timestamp,infouser.nome,(infouser.photo || 'assets/imgs/no-photo.jpg'));
                  this.chatProvider.startChat(chat1,donoProduto.id,userLogged.uid);
                  let chat2 = new Chat('',0,timestamp,donoProduto.nome,(donoProduto.photo || 'assets/imgs/no-photo.jpg'));
                  this.chatProvider.startChat(chat2,userLogged.uid,donoProduto.id);
                })
                }
              });
              this.navCtrl.setRoot(ChatPage,{
                infoUser:donoProduto
              });
          }else{
            this.showAlert('Você não pode abrir uma conversa com o dono do produtos sendo você.');
          } 
        });
    });
  }
  
  private showAlert(message:string):void{
    this.alertCtrl.create({
      message:message,
      buttons:['OK']
    }).present();
  }

}
