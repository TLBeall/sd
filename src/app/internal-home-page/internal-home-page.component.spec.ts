import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalHomePageComponent } from './internal-home-page.component';

describe('InternalHomeDashboardComponent', () => {
  let component: InternalHomePageComponent;
  let fixture: ComponentFixture<InternalHomePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalHomePageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
