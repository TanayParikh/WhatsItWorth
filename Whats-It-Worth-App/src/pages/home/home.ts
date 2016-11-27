import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import { get } from 'http';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(public navCtrl: NavController) {
    this.readFiles();
    this.initializeItems();
  }

  searchQuery: string = '';
  items: string[];
  stocks: string[];

  initializeItems() {
    this.items = [
      'Amsterdam',
      'Bogota'
    ];
  }

  readFiles() {
    var serviceUrl = '../../assets/datasets/';
    get(serviceUrl + 'TSE_Securities.json', function (res) {
        var body = '';
      res.on('data', function(chunk){
         body += chunk;
      });
      res.on('end', function(){
        console.log(body.toString());
      });
    });
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

