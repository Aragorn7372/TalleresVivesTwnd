import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalResumen } from './modal-resumen';

describe('ModalResumen', () => {
  let component: ModalResumen;
  let fixture: ComponentFixture<ModalResumen>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalResumen]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalResumen);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
