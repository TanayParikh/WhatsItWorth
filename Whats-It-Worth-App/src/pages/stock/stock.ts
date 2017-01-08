import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { get } from 'http';

@Component({
  selector: 'page-stock',
  templateUrl: 'stock.html'
})
export class StockPage {
  stock: any;
  stockPrice : number = 0;
  products: any[];
  product = {name: "", plural_name: "", category: "", price: 0, img: ""};
  productGenerated = {name: "", img_link:"", quantity:0};
  constructor(public navCtrl: NavController, private navParams: NavParams) {
    this.stock = navParams.data.stock;

    console.log(this.stock);

    this.setProducts();
  }

  setProducts() {
    if(window.localStorage.getItem('products')){
      this.products = JSON.parse(window.localStorage.getItem('products'));
      this.getStockInformation(this.stock);
    }
    else{
      this.getAllProducts();
    }
    console.log("The products are:");
    console.log(this.products);
  }

  getStockInformation(stock){
    // Sets up YQL request URI
    const baseURL = 'http://query.yahooapis.com/v1/public/yql?format=json&diagnostics=true&env=http%3A%2F%2Fdatatables.org%2Falltables.env&q=select LastTradePriceOnly from yahoo.finance.quotes where symbol = ';
    var queryURI = baseURL + '"' + stock.symbol + (stock.exchange == 'tse' ? '.TO' : '') +'"';

    console.log(stock.exchange);
    console.log(queryURI);

    get({async: false, path: queryURI}, function (res) {
      var body = '';

      res.on('data', function(chunk){
         body += chunk;
      });

      // Parses response and calls for processing
      res.on('end', function() {
        var parsed = JSON.parse(body.toString());
        var price: number = <number>parsed.query.results.quote.LastTradePriceOnly;

        console.log("Price data retireved: " + price);
        console.log(parsed);


        if (!price && stock.symbol.includes('.')) {
          stock.symbol = stock.symbol.replace('.', '-');
        } else {
          this.displayComparison(price);
        }
      }.bind(this));
    }.bind(this));
  }

  displayComparison(price: any) {
    if (!price) {
      alert("Sorry, we were unable to retrieve information for that stock at this time. Please try again.");
      return;
    }

    var count = 0;

    while (count < 50) {
      var index = Math.floor((Math.random() * this.products.length));
      //Convert price for stock and price of product to numbers for proper comparion
      var numPrice = Number(price);
      var numProduct = Number(this.products[index].price);
      console.log("scanning: " + index + " " + this.products[index].price + " " + price);

      if (numProduct < numPrice) {
        this.product = this.products[index];
        break;
      }

      count++;
    }

    this.stockPrice = price;
    this.productGenerated.quantity = Math.floor(this.stockPrice / this.product.price);
    this.productGenerated.name = (this.productGenerated.quantity > 1) ? this.product.plural_name : this.product.name;
    this.productGenerated.img_link = 'http://webexposure.ca/WhatsItWorth/api/product_images/' + this.product.img;
    console.log(this.product);
  }

  getAllProducts() {
    const baseURL = 'http://www.webexposure.ca/WhatsItWorth/api/api.php/products';
    var referance = this;
    var products = new Array();
    get({async: false, path: baseURL}, function (res) {
      var body = '';

      res.on('data', function(chunk){
         body += chunk;
      });

      // Parses response and calls for processing
      res.on('end', function(){
        var rawProducts = JSON.parse(body.toString()).products.records;
        console.log("Records: ");
        console.log(rawProducts);


        rawProducts.forEach(product => {
          products.push({name: product[1], plural_name: product[2],
            category: product[3], price: product[5], img: product[6]});
        });
        window.localStorage.setItem('products',JSON.stringify(products));
        referance.products = products;
        referance.getStockInformation(referance.stock);
      });
    });

  }
}
