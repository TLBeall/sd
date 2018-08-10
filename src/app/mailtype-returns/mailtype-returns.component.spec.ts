import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MailtypeReturnsComponent } from './mailtype-returns.component';

describe('MailtypeReturnsComponent', () => {
  let component: MailtypeReturnsComponent;
  let fixture: ComponentFixture<MailtypeReturnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MailtypeReturnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MailtypeReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
