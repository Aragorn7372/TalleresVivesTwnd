import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {LineaFacturaModel ,Factura} from '../../services/factura';


@Component({
  selector: 'app-linea-factura',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <tr [formGroup]="form">
      <td class="p-2">
        <input
          type="number"
          formControlName="cantidad"
          class="input input-bordered input-sm w-full text-center"
          [class.input-error]="form.get('cantidad')?.invalid && form.get('cantidad')?.touched"
          min="1"
          max="999">
      </td>
      <td class="p-2">
        <input
          type="text"
          formControlName="descripcion"
          class="input input-bordered input-sm w-full"
          [class.input-error]="form.get('descripcion')?.invalid && form.get('descripcion')?.touched"
          placeholder="Descripción"
          maxlength="50">
      </td>
      <td class="p-2">
        <input
          type="number"
          formControlName="precio"
          class="input input-bordered input-sm w-full text-center"
          [class.input-error]="form.get('precio')?.invalid && form.get('precio')?.touched"
          step="0.01"
          min="0">
      </td>
      <td class="p-2">
        <select
          formControlName="iva"
          class="select select-bordered select-sm w-full">
          <option [value]="21">21%</option>
          <option [value]="10">10%</option>
          <option [value]="4">4%</option>
        </select>
      </td>
      <td class="p-2">
        <input
          type="text"
          [value]="linea.importeIva.toFixed(2)"
          class="input input-bordered input-sm w-full text-center bg-base-300"
          readonly>
      </td>
      <td class="p-2">
        <input
          type="text"
          [value]="linea.importe.toFixed(2)"
          class="input input-bordered input-sm w-full text-center bg-base-300"
          readonly>
      </td>
      <td class="p-2">
        <input
          type="text"
          [value]="linea.total.toFixed(2)"
          class="input input-bordered input-sm w-full text-center bg-base-300"
          readonly>
      </td>
      <td class="p-2 text-center">
        <button
          type="button"
          (click)="onEliminar()"
          class="btn btn-error btn-sm">
          Borrar
        </button>
      </td>
    </tr>
  `
})
export class LineaFactura implements OnInit {
  @Input() linea!: LineaFacturaModel;
  @Output() eliminar = new EventEmitter<number>();

  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private facturaService: Factura
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      cantidad: [this.linea.cantidad, [Validators.required, Validators.min(1), Validators.max(999)]],
      descripcion: [this.linea.descripcion, [Validators.required, Validators.maxLength(50)]],
      precio: [this.linea.precio, [Validators.required, Validators.min(0)]],
      iva: [this.linea.iva, Validators.required]
    });

    this.form.valueChanges.subscribe(values => {
      const lineaActualizada = this.facturaService.calcularLineaTotal({
        ...this.linea,
        ...values
      });
      this.facturaService.actualizarLinea(lineaActualizada);
    });
  }

  onEliminar(): void {
    this.eliminar.emit(this.linea.id);
  }
}
