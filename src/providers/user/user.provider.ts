import { Observable } from 'rxjs/Observable';
import { BaseProvider } from './../base/base.provider';
import { AngularFirestoreCollection, AngularFirestoreDocument, AngularFirestore } from 'angularfire2/firestore';
import { Http } from '@angular/http';
import { Injectable } from '@angular/core';

import * as firebase from 'firebase';
import 'firebase/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { User } from '../../models/user.models';


/*
  Generated class for the UserProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class UserProvider extends BaseProvider {

  listUserObservable:Observable<any>;
  userLogged:User;
  private _DB: firebase.firestore.Firestore;
  private afStorage = firebase;

  constructor(
    public http: Http,
    public afAuth:AngularFireAuth
  ) {
      super();
      this._DB = firebase.firestore();
      this.listaUsersAuth();
      console.log('Hello UserProvider Provider');
  }

  createUser(user, uid):Promise<void>{
    return this._DB.collection("users").doc(uid)
      .set(user)
      .catch(this.handlePromiseError);
  } 

  listaUsersAuth():void{
    this.afAuth.authState.subscribe((user)=>{
      if(user){
        this.getDadosUser(user.uid).then((user)=>{
          this.userLogged = <User>user.data();
        })
        this.listUserObservable = this.getUsersNotLogged(user.uid);
      }else{
        console.log('user morreu');
      }
    });
  }

  private getUsersNotLogged(uidToExcluir:string):Observable<any>{
    let listaUsers:any = [];
    let query = this._DB.collection('users').orderBy('nome','asc');
    query.onSnapshot({ includeQueryMetadataChanges: true },function(snapshot) {
      if(snapshot.size){
        snapshot.docChanges.forEach(function(change:firebase.firestore.DocumentChange) {
          if (change.type === 'added') {
            listaUsers.push({
              id : change.doc.id,
              nome : change.doc.data().nome,
              email : change.doc.data().email,
              photo : change.doc.data().photo,
              onesignal : change.doc.data().onesignal,
              tokenonesignal : change.doc.data().pushonesignal,
              username : change.doc.data().username
            })
          }
        });
      }  
    });
    return Observable.of(listaUsers);
  }

  userExists(username: string): Observable<boolean> {
    return Observable.of(false);
  }

  getListaUser():Observable<any>{
    return Observable.of(this._DB.collection('users'));
  }

  getDadosUser(uid:string):Promise<firebase.firestore.DocumentSnapshot>{
    return this._DB.collection('users').doc(uid).get();
  }

  getDadosUserObject(uid:string):firebase.firestore.DocumentReference{
    return this._DB.collection('users').doc(uid);
  }

  editUser(user:{nome:string,username:string,photo:string},uid:string):Promise<void>{
    return this.getDadosUserObject(uid).update(user);
  }

  uploadPhoto(file:File, uidUser:string){
    return this.afStorage.storage().ref().child('/users/'+uidUser).put(file);
  }
}
