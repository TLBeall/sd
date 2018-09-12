import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupRowInnerRenderComponent } from './group-row-inner-render.component';

describe('GroupRowInnerRenderComponent', () => {
  let component: GroupRowInnerRenderComponent;
  let fixture: ComponentFixture<GroupRowInnerRenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupRowInnerRenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupRowInnerRenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
