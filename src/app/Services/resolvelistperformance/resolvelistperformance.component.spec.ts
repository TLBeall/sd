import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolvelistperformanceComponent } from './resolvelistperformance.component';

describe('ResolvelistperformanceComponent', () => {
  let component: ResolvelistperformanceComponent;
  let fixture: ComponentFixture<ResolvelistperformanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolvelistperformanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolvelistperformanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
