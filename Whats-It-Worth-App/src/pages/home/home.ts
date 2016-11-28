import { Component } from '@angular/core';

import { NavController, LoadingController } from 'ionic-angular';

import { get } from 'http';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  constructor(public navCtrl: NavController,
    platform: Platform,
    private loadingController: LoadingController) {
    this.platform = platform;

    let loader = this.loadingController.create({
      content: 'Fetching Stocks'
    });

    loader.present().then(() => {
      this.getStockData();
      this.initializeItems();
      loader.dismiss();
    });
  }

  platform : Platform;
  searchQuery: string = '';
  items: string[];
  fullItems: string[];
  search: boolean = false;

  stocks: string[];

  initializeItems() {
    this.items = (this.search) ? this.fullItems : [];
  }

  getStockData() {
    var serviceUrl = 'https://whatsitworth-c7bd9.firebaseio.com/';

    let exchanges: Array<string> = ["tse", "nasdaq", "nyse"];

    this.fullItems = new Array();
    var tempArray: string[];
    tempArray = new Array();

    for (var j = 0; j < exchanges.length; ++j) {
      get(serviceUrl + 'securities/' + j + '/' + exchanges[j] +'.json', function (res) {
        var body = '';

        res.on('data', function(chunk){
           body += chunk;
        });

        res.on('end', function(){
          var parsed = JSON.parse(body.toString());
          for( var i =0; i<parsed.length; ++i){
            tempArray.push(<string>parsed[i].Name);
          }
        });
      });

      this.fullItems= tempArray;
    }
  }

  getItems(ev: any) {
    this.search = (ev.target.value.length >= 3);

    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    let val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
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

  getStockInformation(symbol){
    var pathAppend = '/d/quotes.csv?s=' + symbol + '&f=j1j3l1';
    var http = require('http');
    http.get({hostname: 'download.finance.yahoo.com', path:pathAppend, agent: false }, (res) => {
      var body = '';
      res.on('data', function(chunk){
         body += chunk;
      });
      res.on('end', function(){
        alert(body.toString())
      });
    });
  }
}

declare function require(path: string): any;
