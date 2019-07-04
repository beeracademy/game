import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FinishModalComponent } from './finish-modal.component';

describe('FinishModalComponent', () => {
  let component: FinishModalComponent;
  let fixture: ComponentFixture<FinishModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FinishModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FinishModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
