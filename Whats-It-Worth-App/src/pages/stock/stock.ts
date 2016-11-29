import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { get } from 'http';

@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html'
})
export class StockPage {
  stock: any;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.stock = navParams.data.stock;
    this.getStockInformation(this.stock.symbol);
  }

  ionViewDidLoad() {
    console.log('Hello StockPage Page');
  }

  getStockInformation(symbol){
    const baseURL = 'http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&q=select LastTradePriceOnly from yahoo.finance.quotes where symbol = ';
    var queryURL = baseURL + '"' + symbol + '"';

    get({path: queryURL}, function (res) {
      var body = '';

      res.on('data', function(chunk){
         body += chunk;
      });

      res.on('end', function(){
        var parsed = JSON.parse(body.toString());
        this.displayStats(parsed.query.results.quote.LastTradePriceOnly);
      });
    });
  }

  displayStats(price: number) {
    
  }
}
