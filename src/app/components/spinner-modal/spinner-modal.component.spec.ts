import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinnerModalComponent } from './spinner-modal.component';

describe('SpinnerModalComponent', () => {
  let component: SpinnerModalComponent;
  let fixture: ComponentFixture<SpinnerModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpinnerModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinnerModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
