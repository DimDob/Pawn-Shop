import { Component, Input } from '@angular/core';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-main-page-pagination',
  templateUrl: './main-page-pagination.component.html',
  standalone: true,
  imports: [MatPaginatorModule],
})
export class MainPagePaginationComponent {
  @Input() length: number = 0;
  @Input() pageSize: number = 10;

  handlePageEvent(event: PageEvent){
        
  }
}
