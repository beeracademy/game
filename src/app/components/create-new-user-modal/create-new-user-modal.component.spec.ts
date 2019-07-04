import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewUserModalComponent } from './create-new-user-modal.component';

describe('CreateNewUserModalComponent', () => {
  let component: CreateNewUserModalComponent;
  let fixture: ComponentFixture<CreateNewUserModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateNewUserModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewUserModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
