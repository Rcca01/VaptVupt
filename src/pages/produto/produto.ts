import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Produto } from '../../models/produto.models';

import * as firebase from 'firebase';
import { ProdutoProvider } from '../../providers/produto/produto';

@Component({
  selector: 'page-produto',
  templateUrl: 'produto.html',
})
export class ProdutoPage {

  produtoForm:FormGroup;
  produto:Produto;
  uidUser:string;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private formBuilder:FormBuilder,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController,
    private providerProduto:ProdutoProvider
  ) {
    this.produtoForm = this.formBuilder.group({
      title:['',[Validators.required]],
      description:['',[Validators.required, Validators.minLength(6)]],
    });
  }

  ionViewDidLoad() {
    this.uidUser = this.navParams.get('uid');
  }

  registrarProduto(){
    let loading:Loading = this.showLoading();
    this.produto = this.produtoForm.value;
    this.produto.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    this.produto.dono = this.uidUser;
    this.providerProduto.createProduto(this.produto,this.uidUser).then(()=>{
      loading.dismiss();
      this.showAlert('Produto Registrado');
    }).catch(()=>{
      loading.dismiss();
      this.showAlert('Produto não registrado');
    })
  }

  private showLoading():Loading{
    let loading:Loading = this.loadingCtrl.create({
      content:"Please wait...",
    });
    loading.present();
    return loading;
  }

  private showAlert(message:string):void{
    this.alertCtrl.create({
      message:message,
      buttons:['OK']
    }).present();
  }

}
