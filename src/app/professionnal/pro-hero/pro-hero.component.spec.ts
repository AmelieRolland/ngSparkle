import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProHeroComponent } from './pro-hero.component';

describe('ProHeroComponent', () => {
  let component: ProHeroComponent;
  let fixture: ComponentFixture<ProHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProHeroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
