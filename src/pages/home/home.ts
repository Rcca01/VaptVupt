import { EditarProdutoPage } from './../editar-produto/editar-produto';
import { ProdutoProvider } from './../../providers/produto/produto';
import { Produto } from './../../models/produto.models';
import { Observable } from 'rxjs/Observable';
import { ProdutoPage } from './../produto/produto';
import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ItemSliding } from 'ionic-angular';
import { User } from '../../models/user.models';
import { AngularFireAuth } from 'angularfire2/auth';
import { DetalhesProdutoPage } from '../detalhes-produto/detalhes-produto';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage {

  user:User
  listaProdutosObservable:Observable<Produto>

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    private produtoProvider:ProdutoProvider,
    private alertCtrl:AlertController,
    public afAuth:AngularFireAuth
  ) {
    
  }

  ionViewDidLoad() {
    this.listaProdutosObservable = this.produtoProvider.getProdutos();
  }

  novoProduto(){
    this.afAuth.authState.subscribe((user)=>{
      this.navCtrl.push(ProdutoPage,{
        uid:user.uid
      });
    });
  }
  
  detalhesProduto(produto:Produto){
    this.navCtrl.push(DetalhesProdutoPage,{
      prod:produto
    })
  }

  editarProduto(produto:Produto,slidingItem: ItemSliding){
    slidingItem.close();
    this.afAuth.authState.subscribe((user)=>{
      if(produto.dono == user.uid){
        this.showAlert('Você não é o dono deste produto');
      }else{
        this.navCtrl.push(EditarProdutoPage,{
          dadosProduto:produto
        })
      }
    });
  }

  apagarProduto(produto:Produto,slidingItem: ItemSliding){
    slidingItem.close();
    this.afAuth.authState.subscribe((user)=>{
      if(produto.dono != user.uid){
        this.produtoProvider.deleteProduto(produto.id).then(()=>{
          this.showAlert('Produto deletado!');
        }).catch(()=>{
          this.showAlert('Erro ao deletar produto!');
        })
      }else{
        this.showAlert('Você não é o dono deste produto');
      }
    });
  }

  private showAlert(message:string):void{
    this.alertCtrl.create({
      message:message,
      buttons:['OK']
    }).present();
  }
}
