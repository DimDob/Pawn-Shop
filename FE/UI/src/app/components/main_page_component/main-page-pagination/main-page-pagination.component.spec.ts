import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainPagePaginationComponent } from './main-page-pagination.component';

describe('MainPagePaginationComponent', () => {
  let component: MainPagePaginationComponent;
  let fixture: ComponentFixture<MainPagePaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainPagePaginationComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainPagePaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
