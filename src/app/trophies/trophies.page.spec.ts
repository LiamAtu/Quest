import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrophiesPage } from './trophies.page';

describe('TrophiesPage', () => {
  let component: TrophiesPage;
  let fixture: ComponentFixture<TrophiesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrophiesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
