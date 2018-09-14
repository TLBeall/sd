import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePageInternalToolbarComponent } from './home-page-internal-toolbar.component';

describe('HomePageInternalToolbarComponent', () => {
  let component: HomePageInternalToolbarComponent;
  let fixture: ComponentFixture<HomePageInternalToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomePageInternalToolbarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomePageInternalToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
