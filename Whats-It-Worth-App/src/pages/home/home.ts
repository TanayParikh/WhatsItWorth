import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { get } from 'http';
import { Platform } from 'ionic-angular';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController, platform: Platform) {
    this.platform = platform;
    this.getStockData();
    this.initializeItems();
  }
  platform : Platform;
  searchQuery: string = '';
  items: string[];
  fullItems: string[];
  search: boolean = false;

  // Stores stock objects
  tse: JSON[];
  nyse: JSON[];
  nasdaq: JSON[];

  stocks: string[];

  initializeItems() {
    if(this.search){
      this.items = this.fullItems;
    }
    else {this.items= [];}
    
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
    if(ev.target.value.length >= 3){
      this.search = true;
    }
    else{ this.search = false;
    }
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