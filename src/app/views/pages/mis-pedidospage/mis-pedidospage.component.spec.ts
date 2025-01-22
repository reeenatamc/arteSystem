import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MisPedidospageComponent } from './mis-pedidospage.component';

describe('MisPedidospageComponent', () => {
  let component: MisPedidospageComponent;
  let fixture: ComponentFixture<MisPedidospageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MisPedidospageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MisPedidospageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
