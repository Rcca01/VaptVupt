import { ListaChatPage } from './../lista-chat/lista-chat';
import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NavController, NavParams, Content, AlertController, LoadingController, Loading } from 'ionic-angular';
import { User } from '../../models/user.models';
import { Message } from '../../models/message.models';
import { Subscription } from 'rxjs';
import { AuthProvider } from '../../providers/auth/auth.provider';
import { UserProvider } from '../../providers/user/user.provider';
import { OneSignal } from '@ionic-native/onesignal';

import { Vibration } from '@ionic-native/vibration';

import * as firebase from 'firebase';
import 'firebase/firestore';

import { ChatProvider } from '../../providers/chat/chat';
import { MessageProvider } from '../../providers/message/message';
import { Chat } from '../../models/chat.models';

@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',
})
export class ChatPage implements OnInit, OnDestroy{
  
  @ViewChild(Content) content: Content;

  userLogged: User;
  userChat: User;
  pageTitle: string = 'chat';
  listMessagesChat: Message[];
  listMessagesAngularFireList:firebase.firestore.CollectionReference;
  listMessagesAngularFireListSegundo:firebase.firestore.CollectionReference;
  flagVibration:boolean=false;
  flg:number;
  lastMessageSendUserLogged:string = '';
  chamadaChats:Subscription;
  newMessage:string=''


  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public authProvider: AuthProvider,
    public chatProvider: ChatProvider,
    public messageProvider: MessageProvider,
    public userProvider:UserProvider,
    private oneSignal: OneSignal,
    private vibration: Vibration,
    private alertCtrl:AlertController,
    private loadingCtrl:LoadingController,
  ) {
  }

  ionViewCanEnter() {
    return this.authProvider.authenticated;
  }

  ionViewDidLoad(){
    this.scrollBottomSendMessage();
  }

  ngOnInit(){
    this.userChat = this.navParams.get('infoUser');
    this.pageTitle = this.userChat.nome;
    this.authProvider.currentUserObservable
      .first()
      .subscribe((user) => {
        this.userLogged = user;
        this.userLogged.id = user.uid;

        this.messageProvider.getMessagesChats(this.userLogged.id, this.userChat.id)
        .subscribe((messages:Message[])=>{
          this.listMessagesChat = messages;
        });
        this.listMessagesAngularFireList = this.messageProvider.getMessagesChatsAngularFireList(this.userLogged.id, this.userChat.id);
        this.listMessagesAngularFireListSegundo = this.messageProvider.getMessagesChatsAngularFireList(this.userChat.id, this.userLogged.id);

        let chatChamado = this.chatProvider.getRefChat(this.userLogged.id, this.userChat.id);
        this.chatProvider.getRefChat(this.userLogged.id, this.userChat.id).get()
        .then((dadosChat:firebase.firestore.DocumentSnapshot)=>{
          let chat = <Chat>dadosChat.data();
          this.chatProvider.updatePhoto(chatChamado,chat.photo,this.userChat.photo)
        });

        //Função para vibrar caso a mensagem não tenha sido enviada pelo user logado
        this.chamadaChats = this.chatProvider.getRefChatChange(this.userLogged.id, this.userChat.id).subscribe((chat:Chat)=>{
          this.chatProvider.getRefChat(this.userLogged.id,this.userChat.id).update({
            ler: 0
          });
          this.scrollBottomSendMessage();
          if(this.lastMessageSendUserLogged){
            this.scrollBottomSendMessage();
            if(this.lastMessageSendUserLogged !== chat.lastMessage){
              this.vibration.vibrate(100);
              this.scrollBottomSendMessage();
            }
          }else{
            this.lastMessageSendUserLogged = chat.lastMessage;
            this.scrollBottomSendMessage();
          }
          this.scrollBottomSendMessage();
        });
        this.scrollBottomSendMessage();
      });
  }
  ngOnDestroy(){
    this.chamadaChats.unsubscribe();
  }

  sendMessage(newMessage: string, tipo:string): void {
    if (newMessage) {
      let timestampAtual = firebase.firestore.FieldValue.serverTimestamp();
      this.messageProvider.createMessageChat(
        new Message(this.userChat.id, newMessage, tipo, timestampAtual),
        this.listMessagesAngularFireList
      ).then(() => {
        this.lastMessageSendUserLogged = newMessage;
        this.scrollBottomSendMessage();
        this.chatProvider.getRefChat(this.userLogged.id, this.userChat.id).update({
          lastMessage: newMessage,
          timestamp: timestampAtual
        });
        
        this.chatProvider.getLastMessage(this.userChat.id,this.userLogged.id)
        .then((dadosChat:firebase.firestore.DocumentSnapshot)=>{
          if(!dadosChat.exists){
            this.userProvider.getDadosUser(this.userLogged.id)
            .then((dadosUser:firebase.firestore.DocumentSnapshot)=>{
              let infouser = <User>dadosUser.data();
              let timestamp:Object = firebase.firestore.FieldValue.serverTimestamp();
              let chat1 = new Chat(newMessage,1,timestamp,infouser.nome,(infouser.photo || 'assets/imgs/no-photo.jpg'));
              this.chatProvider.startChat(chat1,this.userChat.id,this.userLogged.id);
            })
          }else{
            let chat = <Chat>dadosChat.data();
            this.chatProvider.getRefChat(this.userChat.id, this.userLogged.id).update({
              lastMessage: newMessage,
              ler: ++chat.ler,
              timestamp: timestampAtual
            });
          }
        });
        let notificationObj:any = {
          contents:{
            en: newMessage
          },
          include_player_ids: [this.userChat.onesignal]
        };
        this.oneSignal.postNotification(notificationObj);
      });
      this.messageProvider.createMessageChat(
        new Message(this.userChat.id, newMessage, tipo, timestampAtual),
        this.listMessagesAngularFireListSegundo
      )
    }
  }

  voltarChat(){
    this.navCtrl.setRoot(ListaChatPage);
  }

  scrollBottomSendMessage(duration?: number,vibrar?:boolean): void {    
    setTimeout(() => {
      if (this.content._scroll) {
        this.content.scrollToBottom(duration || 300);
      }
    }, 50);
    if(vibrar){
      this.vibration.vibrate(1000);
      navigator.vibrate(1000);
    }
  }

  presentAlert(texto:string) {
    let alert = this.alertCtrl.create({
      title: 'Upload áudio',
      subTitle: texto,
      buttons: ['Dismiss']
    });
    alert.present();
  }  

  private showLoading(texto:string):Loading{
    let loading:Loading = this.loadingCtrl.create({
      content:texto,
    });
    loading.present();
    return loading;
  }

}
