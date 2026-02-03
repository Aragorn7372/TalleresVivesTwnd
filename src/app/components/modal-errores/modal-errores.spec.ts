import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalErrores } from './modal-errores';

describe('ModalErrores', () => {
  let component: ModalErrores;
  let fixture: ComponentFixture<ModalErrores>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalErrores]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalErrores);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
