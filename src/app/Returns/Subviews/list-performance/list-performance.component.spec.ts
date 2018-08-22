import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPerformanceComponent } from './list-performance.component';

describe('ListPerformanceComponent', () => {
  let component: ListPerformanceComponent;
  let fixture: ComponentFixture<ListPerformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPerformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPerformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
