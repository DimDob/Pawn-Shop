import { Component, OnInit } from '@angular/core';
import { Shoes } from './Interfaces/Shoes';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrl: './main-page.component.scss',
  standalone: true,
  imports: [MatPaginatorModule, NgForOf],
})
export class MainPageComponent implements OnInit {

  public length: number = 100;
  public pageSize: number = 10;
  // BE has to create table for each specific product category - shoes/electronics etc.
  public shoes: Shoes[]

  // DEMO Delete after upper TODO is implemented
  private shoe1: Shoes = {
    picture: 'http://pngimg.com/uploads/running_shoes/running_shoes_PNG5782.png',
    color: 'blue',
    size: 12,
    sex: 'male',
    manufacturer: 'Nike',
    model: 'Air Max'
  }

  private shoe2: Shoes = {
    picture: 'https://www.shutterstock.com/shutterstock/photos/2283568895/display_1500/stock-photo-white-sneaker-with-light-blue-accents-on-a-white-isolated-background-sport-concept-men-s-fashion-2283568895.jpg',
    color: 'black',
    size: 13,
    sex: 'female',
    manufacturer: 'Adidas',
    model: 'something'
  }
  ngOnInit(): void {
    this.shoes = [this.shoe1, this.shoe2]
    console.log(this.shoes)
  }

  handlePageEvent(event: PageEvent) {
    console.log(event);
    
    // Implement pagination logic fetch product 
  }

  requestPurchase() {
    // TODO check if product is available at the db
  }
}
