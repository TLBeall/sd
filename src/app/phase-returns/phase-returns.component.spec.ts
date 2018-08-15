import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhaseReturnsComponent } from './phase-returns.component';

describe('PhaseReturnsComponent', () => {
  let component: PhaseReturnsComponent;
  let fixture: ComponentFixture<PhaseReturnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhaseReturnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhaseReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
