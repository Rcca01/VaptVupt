import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProvider } from '../../providers/auth/auth.provider';
import { UserProvider } from '../../providers/user/user.provider';
import { User } from '../../models/user.models';

import * as firebase from 'firebase';
import 'firebase/firestore';

@Component({
  selector: 'page-perfil',
  templateUrl: 'perfil.html',
})
export class PerfilPage {

  currentUser:User;
  canEdit:Boolean=false;
  private photoAtual:File;
  progressUpload:number = 0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public authProvider:AuthProvider,
    public userProvider:UserProvider
  ) {
  }

  ionViewCanEnter():boolean{
    return this.authProvider.authenticated;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
    this.authProvider.currentUserObservable.subscribe((infoUser)=>{
      let user = this.userProvider.getDadosUser(infoUser.uid).then((user)=>{
        this.currentUser = <User>user.data();
        this.currentUser.id = infoUser.uid;
        console.log(<User>user.data());
      })
    });
  }

  onEditUser(event:Event):void{
    event.preventDefault();
    if(this.photoAtual){
      this.authProvider.currentUserObservable.subscribe((user:User)=>{
        if(user){
          let result =  this.userProvider.uploadPhoto(this.photoAtual,user.id);
          result.on('state_changed',(snapshot:firebase.storage.UploadTaskSnapshot)=>{
            this.progressUpload = Math.round((snapshot.bytesTransferred / snapshot.totalBytes)*100);
          }, (error:Error)=>{

          }, ()=>{
            this.editarUser(result.snapshot.downloadURL);
          });
        }
      });
    }else{
      this.editarUser();
    }  
  }

  newPhoto(event):void{
    this.photoAtual = event.target.files[0];
  }

  private editarUser(photoUrl?:string):void{
    this.userProvider.editUser({
      nome: this.currentUser.nome,
      username: this.currentUser.username,
      photo: photoUrl || this.currentUser.photo || ''
    },this.currentUser.id).then(()=>{
      this.canEdit = false;
      this.photoAtual = undefined;
      this.progressUpload = 0;
    });
  }
}
