import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';

import { get } from 'http';
import { Platform } from 'ionic-angular';

import { StockPage } from '../stock/stock';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  constructor(public navCtrl: NavController,
    platform: Platform,
    private loadingController: LoadingController) {
    this.platform = platform;
    this.navController = navCtrl;

    let loader = this.loadingController.create({
      content: 'Fetching Stocks'
    });

    loader.present().then(() => {
      // window.localStorage.clear(); // Clears existing cache
      if(!window.localStorage.getItem('stock-data-exp')){
        var expDate = new Date();
        expDate.setDate(expDate.getDate() + 7);
        window.localStorage.setItem('stock-data-exp',expDate.toString());
        console.log(expDate.toString());
        this.tempTest = this.getStockData();
        this.initializeItems();
      }
      else{
        var date = new Date();
        var expDate = new Date(window.localStorage.getItem('stock-data-exp'));
        if(date > expDate){
              expDate.setDate(date.getDate() + 7);
              window.localStorage.setItem('stock-data-exp', JSON.stringify(expDate));
              this.tempTest = this.getStockData();
              this.initializeItems();
            }
          else{
            if(!window.localStorage.getItem('stock-data')){
              this.tempTest = this.getStockData();
              this.initializeItems();
            }
            else{
              this.tempTest = JSON.parse(window.localStorage.getItem('stock-data'));
              this.tempFix = true;
            }

            }

    }
    loader.dismiss();
    });
      }


  platform : Platform;
  navController : NavController;
  searchQuery: string = '';
  items: any;
  search: boolean = false;
  stocks: any = [{sector: "none", name:"", sym:"", exchange:""}];
  tempTest: any = [{sector: "none", name:"", sym:"", exchange:""}];
  tempFix: boolean = false;

  initializeItems() {
    if((this.tempTest.length > 1 && !this.tempFix)){
      for(var i =0; i< this.tempTest.length ; i++){
        var stock = this.tempTest[i];
        stock.sector = this.getIconName(stock.sector);
        this.tempTest[i] = stock;
      }
      this.tempFix = true;
       window.localStorage.setItem('stock-data',JSON.stringify(this.tempTest));
    }
    this.stocks = (this.search) ? this.tempTest : [{sector: "none", name:"", sym:"", exchange:""}];
  }

  getStockData() {
    //var app = angular.module('app',['ionic']);
    var serviceUrl = 'https://whatsitworth-c7bd9.firebaseio.com/';

    let exchanges: Array<string> = ["tse", "nasdaq", "nyse"];
    var tempArray = [];
    for (var j = 0; j < exchanges.length; ++j) {
      const exchange : string = exchanges[j];
      get({async: false, path: serviceUrl + 'securities/' + j + '/' + exchanges[j] +'.json'}, function (res) {
        var body = '';
        const exc = exchange;

        res.on('data', function(chunk){
           body += chunk;
        });

        res.on('end', function(){

          var parsed = JSON.parse(body.toString());
          for( var i =0; i<parsed.length; ++i){
            var fixedName = <String>parsed[i].Name;
            fixedName = fixedName.replace("&#39;","'");
            tempArray.push({name : fixedName,symbol: <string>parsed[i].Symbol, sector: <string>parsed[i].Sector, exchange: exc});
          }
        });
      });
    }

    return tempArray;
  }

  getItems(ev: any) {
    this.search = ev.target.value ? (ev.target.value.length >= 3) : false;

    if (this.search) {
      // Reset items back to all of the items
      this.initializeItems();

      // set val to the value of the searchbar
      let val = ev.target.value;

      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.stocks = this.stocks.filter((item) => {
          return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
        })
      }
    }
  }

  getIconName(sector: string) {
    switch (sector) {
      case "Basic Industries":  return "cog";
      case "Industrials": return "cog";
      case "Capital Goods": return "cube";
      case "Materials": return "cube";
      case "n/a": return "square";
      case "Miscellaneous": return "square";
      case "Consumer Discretionary": return "basket";
      case "Consumer Durables": return "cart";
      case "Consumer Non-Durables": return "cart";
      case "Consumer Services": return "build";
      case "Consumer Staples": return "basket";
      case "Energy": return "flash";
      case "Finance": return "cash";
      case "Financials": return "cash";
      case "Cash and/or derivatives": return "cash";
      case "Health Care": return "medkit";
      case "Information Technology": return "phone-portrait";
      case "Technology": return "phone-portrait";
      case "Public Utilities": return "water";
      case "Utilities": return "water";
      case "Real Estate": return "home";
      case "Telecommunications": return "call";
      case "Transportation": return "car";
    }
  }

  stockSelected(stock) {
    this.navCtrl.push(StockPage, {
      stock: stock
    });
  }

  clearStocks(event: any) {
    this.searchQuery = '';
    this.stocks = [{sector: "none", name:"", sym:"", exchange:""}];
  }
}

declare function require(path: string): any;
