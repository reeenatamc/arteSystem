import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PieceManagementComponent } from './piece-management.component';

describe('PieceManagementComponent', () => {
  let component: PieceManagementComponent;
  let fixture: ComponentFixture<PieceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PieceManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PieceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
