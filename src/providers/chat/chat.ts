import { Message } from './../../models/message.models';
import { Observable } from 'rxjs/Observable';
import { Chat } from './../../models/chat.models';
import { BaseProvider } from './../base/base.provider';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase';
import 'firebase/storage';
import { UploadTask } from '@firebase/storage-types';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
/*
  Generated class for the ChatProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ChatProvider extends BaseProvider{

  listChatsObservable:Observable<any>;
  private _DB: firebase.firestore.Firestore;
  private afStorage = firebase;

  constructor(
    public http: Http,
    public afAuth:AngularFireAuth
  ) {
    super();
    this._DB = firebase.firestore();
    this.getChatsUserLogged();
    console.log('Hello ChatProvider Provider');
  }

  getChatsUserLogged():void{
    this.afAuth.authState.subscribe((user)=>{
      if(user){
        this.listChatsObservable = this.getChats(user.uid);
      }
    });
  }
  
  private getChats(uidLogged:string):Observable<any>{
    let listaChats:any = [];
    let query = this._DB.collection('chats').doc(uidLogged).collection('mychats').orderBy('title','asc');
    query.onSnapshot({ includeQueryMetadataChanges: true },function(snapshot) {
      if(snapshot.size){
        snapshot.docChanges.forEach(function(change:firebase.firestore.DocumentChange) {
          if (change.type === 'added') {
            listaChats.push({
              id: change.doc.id,
              lastMessage: change.doc.data().lastMessage,
              ler: change.doc.data().ler,
              timestamp: change.doc.data().timestamp,
              title: change.doc.data().title,
              photo: change.doc.data().photo
            })
          }else if(change.type === 'modified'){
            listaChats.forEach((chat:Chat)=>{
              if(change.doc.id === chat.id){
                chat.lastMessage = change.doc.data().lastMessage;
                chat.ler = change.doc.data().ler;
                chat.timestamp = change.doc.data().timestamp;
              }
            })
          }
        });
      }  
    });
    return Observable.of(listaChats);
  }

  startChat(chat:Chat, userUid1:string, userUid2:string):Promise<void>{
    return this._DB.collection('chats').doc(userUid1).collection('mychats').doc(userUid2)
      .set(Object.assign({}, chat))
      .catch(this.handlePromiseError);
  }

  getLastMessage(userLoggedUid:string, userChatUid:string):Promise<firebase.firestore.DocumentSnapshot>{
    return this._DB.collection('chats').doc(userLoggedUid).collection('mychats').doc(userChatUid).get();
  }

  getRefChat(userLoggedUid:string, userChatUid:string):firebase.firestore.DocumentReference{
    return this._DB.collection('chats').doc(userLoggedUid).collection('mychats').doc(userChatUid);
  }

  getRefChatChange(userLoggedUid:string, userChatUid:string):Observable<any>{
    return Observable.of(this._DB.collection('chats').doc(userLoggedUid).collection('mychats')
    .doc(userChatUid).onSnapshot(function () {}));
  }

  updatePhoto(chat:firebase.firestore.DocumentReference, photoAtual:string, novaPhoto:string):Promise<boolean>{
    if(photoAtual != novaPhoto){
      return chat.update({photo:novaPhoto}).then(()=>{
        return true;
      }).catch(this.handlePromiseError);
    }else{
      return Promise.resolve(false);
    }
  }

  uploadPhotoChat(filename:string,photo:string){
    return this.afStorage.storage().ref().child('/imagens/'+filename)
      .putString(photo,firebase.storage.StringFormat.DATA_URL)
  }
}