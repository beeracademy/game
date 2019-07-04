import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginModalItemComponent } from './login-modal-item.component';

describe('LoginModalItemComponent', () => {
  let component: LoginModalItemComponent;
  let fixture: ComponentFixture<LoginModalItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginModalItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginModalItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
