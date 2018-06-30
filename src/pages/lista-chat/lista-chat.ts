import { Component } from '@angular/core';
import { NavController, NavParams, MenuController, ToastController, Toast } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Chat } from '../../models/chat.models';
import { Subscription } from 'rxjs';
import { AuthProvider } from '../../providers/auth/auth.provider';
import { UserProvider } from '../../providers/user/user.provider';
import { ChatProvider } from '../../providers/chat/chat';
import { Vibration } from '@ionic-native/vibration';
import { User } from '../../models/user.models';
import { ChatPage } from '../chat/chat';

import * as firebase from 'firebase';


@Component({
  selector: 'page-lista-chat',
  templateUrl: 'lista-chat.html',
})
export class ListaChatPage {

  chatsLista:Observable<Chat[]>;
  startPage:boolean=true;
  chamadaChats:Subscription;

  view:string = 'chats';

  constructor(
    public navCtrl: NavController,
    public authProvider: AuthProvider,
    public userProvider:UserProvider,
    public chatProvider:ChatProvider,
    public menuCtrl:MenuController,
    private vibration: Vibration,
    private toastCtrl: ToastController
  ) {

  }

  ionViewCanEnter():boolean{
    return this.authProvider.authenticated;
  }

  ionViewDidLoad(){
    this.chatsLista = this.chatProvider.listChatsObservable;    
    this.menuCtrl.enable(true, 'user-menu');    
    this.chamadaChats = this.chatProvider.listChatsObservable.subscribe(()=>{
      if(this.startPage){
        this.startPage = false;
      }else{
        this.vibration.vibrate(100);
      }
    });
  }

  searchList(event:any){
    let search = event.target.value;
    this.chatsLista = this.chatProvider.listChatsObservable;

    if(search){
      this.chatsLista = <Observable<Chat[]>>this.chatsLista.map((chats:Chat[])=>{
        return chats.filter((chat:Chat)=>{
          return (chat.title.toLocaleLowerCase().indexOf(search.toLocaleLowerCase()) > -1);
        });
      });
    }
  }

  apagarChat(chat:Chat,i:number){
    this.authProvider.currentUserObservable
    .first()
    .subscribe((user)=>{
        this.chatProvider.getRefChat(user.uid,chat.id).delete().then(()=>{
        this.chatsLista.subscribe((chats:Chat[])=>{
          chats.splice(i);
        })
        this.presentToast('O chat com '+chat.title+' foi removido da lista').present();
      }).catch(()=>{
        this.presentToast('Erro ao remover chat').present();
      });
    });
  }

  openChat(uidDestinatario:string):void{
    this.userProvider.getDadosUser(uidDestinatario).then((user:firebase.firestore.DocumentSnapshot)=>{
      let dadosUser = <User>user.data();
      dadosUser.id = uidDestinatario;
      this.navCtrl.setRoot(ChatPage,{
        infoUser:dadosUser
      });
    })
  }

  presentToast(mensagem:string):Toast {
    let toast = this.toastCtrl.create({
      message: mensagem,
      duration: 3000,
      position: 'bottom'
    });
    return toast;
  }

}
