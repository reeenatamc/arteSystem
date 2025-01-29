import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistEditProfileComponent } from './artist-edit-profile.component';

describe('ArtistEditProfileComponent', () => {
  let component: ArtistEditProfileComponent;
  let fixture: ComponentFixture<ArtistEditProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArtistEditProfileComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArtistEditProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
