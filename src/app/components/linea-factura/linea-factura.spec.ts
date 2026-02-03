import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LineaFactura } from './linea-factura';

describe('LineaFactura', () => {
  let component: LineaFactura;
  let fixture: ComponentFixture<LineaFactura>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LineaFactura]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LineaFactura);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
