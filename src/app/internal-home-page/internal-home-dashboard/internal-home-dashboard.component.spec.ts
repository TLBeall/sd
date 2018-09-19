import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalHomeDashboardComponent } from './internal-home-dashboard.component';

describe('InternalHomeDashboardComponent', () => {
  let component: InternalHomeDashboardComponent;
  let fixture: ComponentFixture<InternalHomeDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalHomeDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalHomeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
