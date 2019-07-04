import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersItemComponent } from './players-item.component';

describe('PlayersItemComponent', () => {
  let component: PlayersItemComponent;
  let fixture: ComponentFixture<PlayersItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlayersItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayersItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
