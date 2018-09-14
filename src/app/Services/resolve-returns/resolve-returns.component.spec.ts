import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveReturnsComponent } from './resolve-returns.component';

describe('ResolveReturnsComponent', () => {
  let component: ResolveReturnsComponent;
  let fixture: ComponentFixture<ResolveReturnsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResolveReturnsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResolveReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
