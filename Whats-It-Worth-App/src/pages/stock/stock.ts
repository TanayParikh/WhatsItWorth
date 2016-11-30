import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { get } from 'http';

@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html'
})
export class StockPage {
  stock: any;
  products: any[];
  product: JSON;

  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.stock = navParams.data.stock;

    console.log(this.stock);

    this.setProducts();
    this.getStockInformation(this.stock)
  }

  ionViewDidLoad() {
    console.log('Hello StockPage Page');
  }

  setProducts() {
    if(!window.localStorage.getItem('products')){
      this.getAllProducts();
    }

    this.products = JSON.parse(window.localStorage.getItem('products'));
    console.log("THE PRODUCTS ARE:");
    console.log(this.products);
  }

  getStockInformation(stock){
    // Sets up YQL request URI
    const baseURL = 'http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&q=select LastTradePriceOnly from yahoo.finance.quotes where symbol = ';
    var queryURI = baseURL + '"' + stock.symbol + (stock.exchange == 'tse' ? '.TO' : '') +'"';

    console.log(stock.exchange);
    console.log(queryURI);

    var that = this;

    get({path: queryURI}, function (res) {
      var body = '';

      res.on('data', function(chunk){
         body += chunk;
      });

      // Parses response and calls for processing
      res.on('end', function(){
        var parsed = JSON.parse(body.toString());
        that.displayComparison(<number>parsed.query.results.quote.LastTradePriceOnly);
      });
    });
  }

  displayComparison(price: any) {
    //var product : JSON;

    if (!price) {
      alert("Sorry, we were unable to retrieve information for that stock at this time. Please try again.");
      return;

    }
    
    var count : number;

    while (true) {
      var index = Math.floor((Math.random() * this.products.length));

      console.log("scanning: " + index);

      if (this.products[index].price < price) {
        this.product = this.products[index];
        break;
      }

      if (++count > 50) break;
    }

    console.log(this.product);
  }

  getAllProducts() {
    const baseURL = 'http://www.webexposure.ca/WhatsItWorth/api/api.php/products';

    get(baseURL, function (res) {
      var body = '';

      res.on('data', function(chunk){
         body += chunk;
      });

      // Parses response and calls for processing
      res.on('end', function(){
        var rawProducts = JSON.parse(body.toString()).products.records;
        console.log("Records: ");
        console.log(rawProducts);
        //this.tempFix = true;
        var products = new Array();

        rawProducts.forEach(product => {
          products.push({name: product[1], plural_name: product[2],
            category: product[3], price: product[5], img: product[6]});
        });

        window.localStorage.setItem('products',JSON.stringify(products));
      });
    });
  }
}
