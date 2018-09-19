import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalHomeToolboxComponent } from './internal-home-toolbox.component';

describe('InternalHomeToolboxComponent', () => {
  let component: InternalHomeToolboxComponent;
  let fixture: ComponentFixture<InternalHomeToolboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalHomeToolboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalHomeToolboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
