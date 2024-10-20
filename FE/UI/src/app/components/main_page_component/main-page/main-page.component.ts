import { Component, OnInit } from "@angular/core";
import { Shoes } from "./Interfaces/Shoes";
import { SeedDataService } from "./seedData/seed-data.service";

@Component({
  selector: "app-main-page",
  templateUrl: "./main-page.component.html",
  styleUrls: ["./main-page.component.scss"]
})
export class MainPageComponent implements OnInit {
  public shoes: Shoes[];

  constructor(private seedDataService: SeedDataService) {}

  ngOnInit(): void {
    this.shoes = this.seedDataService.shoes;
    console.log(this.shoes);
  }

  requestPurchase() {
    // TODO check if product is available at the db
  }
}
