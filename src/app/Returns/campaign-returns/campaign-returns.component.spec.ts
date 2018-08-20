import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CampaignReturnsComponent } from './campaign-returns.component';

describe('CampaignReturnsComponent', () => {
  let component: CampaignReturnsComponent;
  let fixture: ComponentFixture<CampaignReturnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CampaignReturnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CampaignReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
