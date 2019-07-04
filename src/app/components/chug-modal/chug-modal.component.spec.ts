import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChugModalComponent } from './chug-modal.component';

describe('ChugModalComponent', () => {
  let component: ChugModalComponent;
  let fixture: ComponentFixture<ChugModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChugModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChugModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
