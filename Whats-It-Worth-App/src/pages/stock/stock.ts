import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Stock page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html'
})
export class StockPage {
  stock: any;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.stock = navParams.data.stock;
    console.log(this.stock.symbol);
  }

  ionViewDidLoad() {
    console.log('Hello StockPage Page');
  }

}
