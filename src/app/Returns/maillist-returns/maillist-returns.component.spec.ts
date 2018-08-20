import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaillistReturnsComponent } from './maillist-returns.component';

describe('MaillistReturnsComponent', () => {
  let component: MaillistReturnsComponent;
  let fixture: ComponentFixture<MaillistReturnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaillistReturnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaillistReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
