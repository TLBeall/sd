import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainReturnsToolboxComponent } from './main-returns-toolbox.component';

describe('MainReturnsToolboxComponent', () => {
  let component: MainReturnsToolboxComponent;
  let fixture: ComponentFixture<MainReturnsToolboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainReturnsToolboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainReturnsToolboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
