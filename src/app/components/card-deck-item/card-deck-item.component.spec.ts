import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CardDeckItemComponent } from './card-deck-item.component';

describe('CardDeckItemComponent', () => {
  let component: CardDeckItemComponent;
  let fixture: ComponentFixture<CardDeckItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CardDeckItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardDeckItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
