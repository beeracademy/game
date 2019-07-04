import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCountdownComponent } from './game-countdown.component';

describe('GameCountdownComponent', () => {
  let component: GameCountdownComponent;
  let fixture: ComponentFixture<GameCountdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameCountdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameCountdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
