import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { Produto } from './../../models/produto.models';

import * as firebase from 'firebase';
import 'firebase/storage';

/*
  Generated class for the ProdutoProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ProdutoProvider {

  private _DB: firebase.firestore.Firestore;

  constructor(public http: HttpClient) {
    this._DB = firebase.firestore();
  }

  public getProdutos():Observable<any>{
    let listaProdutos:Array<any> = [];
    let query = this._DB.collection('produtos').orderBy('title','asc');
    query.onSnapshot({ includeQueryMetadataChanges: true },function(snapshot) {
      snapshot.docChanges.forEach(function(change:firebase.firestore.DocumentChange) {
        if (change.type === 'added') {
          listaProdutos.push({
            id: change.doc.id,
            timestamp: change.doc.data().timestamp,
            title: change.doc.data().title,
            description: change.doc.data().description,
            dono: change.doc.data().dono
          })
        }else if(change.type === 'modified'){
          listaProdutos.forEach((produto:Produto)=>{
            if(change.doc.id === produto.id){
              produto.timestamp = change.doc.data().timestamp,
              produto.title = change.doc.data().title,
              produto.description = change.doc.data().description,
              produto.dono = change.doc.data().dono
            }
          })
        }else{
          listaProdutos.forEach((produto:Produto,index:number)=>{
            if(change.doc.id === produto.id){
              listaProdutos.splice(index, 1);
            }
          });
        }
      });
    });
    return Observable.of(listaProdutos);
  }

  createProduto(produto:Produto,uid:string):Promise<firebase.firestore.DocumentReference>{
    return this._DB.collection('produtos').add(produto);
    
  }
  
  updateProduto(produto:{title:string,description:string},id:string):Promise<void>{
    return this._DB.collection('produtos').doc(id).update(produto);
  }

  deleteProduto(id:string):Promise<void>{
    return this._DB.collection('produtos').doc(id).delete();
  }

}
