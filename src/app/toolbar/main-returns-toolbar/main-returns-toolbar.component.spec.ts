import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainReturnsToolbarComponent } from './main-returns-toolbar.component';

describe('MainReturnsToolbarComponent', () => {
  let component: MainReturnsToolbarComponent;
  let fixture: ComponentFixture<MainReturnsToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainReturnsToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainReturnsToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
