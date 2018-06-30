import { Component } from '@angular/core';
import { NavController, NavParams, Loading, LoadingController, AlertController } from 'ionic-angular';
import { Produto } from '../../models/produto.models';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProdutoProvider } from '../../providers/produto/produto';

import * as firebase from 'firebase';

@Component({
  selector: 'page-editar-produto',
  templateUrl: 'editar-produto.html',
})
export class EditarProdutoPage {

  produtoForm:FormGroup;
  produto:Produto;

  constructor(
    public navCtrl: NavController,
    private formBuilder:FormBuilder,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController,
    public navParams: NavParams,    
    private providerProduto:ProdutoProvider
  ) 
  {
    this.produtoForm = this.formBuilder.group({
      title:['',[Validators.required]],
      description:['',[Validators.required, Validators.minLength(6)]],
    });
  }

  ionViewDidLoad() {
    this.produto = this.navParams.get('dadosProduto');
    console.log(this.produto);
  }

  editarProduto(){
    let loading:Loading = this.showLoading();
    //this.produto.timestamp = firebase.firestore.FieldValue.serverTimestamp();
    this.providerProduto.updateProduto({title:this.produtoForm.value.title,description:this.produtoForm.value.description},this.produto.id).then(()=>{
      loading.dismiss();
      this.showAlert('Produto Editado');
    }).catch(()=>{
      loading.dismiss();
      this.showAlert('Produto não editado');
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
