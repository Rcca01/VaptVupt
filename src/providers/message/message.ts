import { Message } from './../../models/message.models';
import { Observable } from 'rxjs/Observable';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import 'firebase/firestore';

/*
  Generated class for the MessageProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class MessageProvider {

  private _DB: firebase.firestore.Firestore;

  constructor(
    public http: Http
  ) {
    this._DB = firebase.firestore();
    console.log('Hello MessageProvider Provider');
  }

  createMessageChat(message:Message, listMessages:firebase.firestore.CollectionReference){
    return Promise.resolve(listMessages.add(Object.assign({}, message)));
  }

  getMessagesChats(uidUser1:string, uidUser2:string):Observable<any>{
    let messages:Message[] = [];
    var query = this._DB.collection('/messages/').doc(uidUser1+'-'+uidUser2).collection('lista').orderBy('timestamp','asc');
    query.onSnapshot({ includeQueryMetadataChanges: true },function(snapshot) {
      snapshot.docChanges.forEach(function(change:firebase.firestore.DocumentChange) {
        if (change.type === 'added') {
          messages.push({
            id: change.doc.id,
            text:change.doc.data().text,
            tipo:change.doc.data().tipo,
            timestamp:change.doc.data().timestamp,
            uid: change.doc.data().uid
          })
        }else if (change.type === 'modified'){
          messages.forEach((message:Message)=>{
            if(change.doc.id === message.id){
              message.timestamp = change.doc.data().timestamp;
            }
          })
        }
      });
    });
    return Observable.of(messages)
  }
  getMessagesChatsAngularFireList(uidUser1:string, uidUser2:string):firebase.firestore.CollectionReference{
    return this._DB.collection('/messages/').doc(uidUser1+'-'+uidUser2).collection('lista');
  }

}