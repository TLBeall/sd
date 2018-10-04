import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPerformanceToolbarComponent } from './list-performance-toolbar.component';

describe('ListPerformanceToolbarComponent', () => {
  let component: ListPerformanceToolbarComponent;
  let fixture: ComponentFixture<ListPerformanceToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPerformanceToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPerformanceToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
