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
    this.readFiles();
    this.initializeItems();
  }
  platform : Platform;
  searchQuery: string = '';
  items: string[];
  fullItems: string[];
  stocks: string[];

  initializeItems() {
    console.log("Full:" + this.fullItems);
    this.items = this.fullItems;
    console.log("Items: " + this.items);
  }

  readFiles() {
     var tempArray = new Array();
     
    var serviceUrl = '../../assets/datasets/';
    get(serviceUrl + 'TSE_Securities.json', function (res) {
        var body = '';
      res.on('data', function(chunk){
         body += chunk;
      });
      res.on('end', function(){
        var parsed = JSON.parse(body.toString());
        for( var i =0; i<parsed.length; ++i){
          tempArray.push(<String>parsed[i].Name);
        }
       
      });
    });
     this.fullItems = new Array();
        this.fullItems = tempArray;
  }

  getItems(ev: any) {
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

  getCVS(symbol){
    var pathAppend = '/d/quotes.csv?s=' + symbol + '&f=n';
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

