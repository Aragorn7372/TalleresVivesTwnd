import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatosCliente, LineaFacturaModel, TotalesFactura } from '../../services/factura';

@Component({
  selector: 'app-modal-resumen',
  standalone: true,
  imports: [CommonModule],
  template: `
    <dialog #modal class="modal" [class.modal-open]="isOpen">
      <div class="modal-box w-11/12 max-w-5xl bg-base-100">
        <div class="bg-success text-success-content p-4 rounded-t-lg -m-6 mb-4">
          <h3 class="font-bold text-lg">✓ Resumen de Factura</h3>
        </div>

        <div class="space-y-6">
          <!-- Datos del Cliente -->
          <div>
            <h4 class="text-success font-bold text-lg mb-3">Datos del Cliente</h4>
            <div class="overflow-x-auto">
              <table class="table table-sm">
                <tbody>
                  <tr><th>Número de Factura:</th><td>{{ datosCliente.numero }}</td></tr>
                  <tr><th>Nombre:</th><td>{{ datosCliente.nombre }}</td></tr>
                  <tr><th>Fecha:</th><td>{{ datosCliente.fecha }}</td></tr>
                  <tr><th>Documento:</th><td>{{ datosCliente.documento }}</td></tr>
                  <tr><th>Email:</th><td>{{ datosCliente.email }}</td></tr>
                  <tr><th>Teléfono:</th><td>{{ datosCliente.telefono }}</td></tr>
                  <tr>
                    <th>Dirección:</th>
                    <td>{{ datosCliente.localidad }}, {{ datosCliente.provincia }} ({{ datosCliente.cp }})</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Líneas de Factura -->
          <div>
            <h4 class="text-success font-bold text-lg mb-3">Líneas de Factura</h4>
            <div class="overflow-x-auto">
              <table class="table table-sm table-zebra">
                <thead>
                  <tr>
                    <th>Cant.</th>
                    <th>Descripción</th>
                    <th>Precio</th>
                    <th>IVA</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let linea of lineas">
                    <td>{{ linea.cantidad }}</td>
                    <td>{{ linea.descripcion }}</td>
                    <td>{{ linea.precio.toFixed(2) }} €</td>
                    <td>{{ linea.iva }}%</td>
                    <td>{{ linea.total.toFixed(2) }} €</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Totales -->
          <div>
            <h4 class="text-success font-bold text-lg mb-3">Totales</h4>
            <div class="overflow-x-auto">
              <table class="table table-sm">
                <tbody>
                  <tr>
                    <th>Base IVA 21%:</th>
                    <td class="text-right">{{ totales.base21.toFixed(2) }} €</td>
                    <th>IVA 21%:</th>
                    <td class="text-right">{{ totales.iva21.toFixed(2) }} €</td>
                  </tr>
                  <tr>
                    <th>Base IVA 10%:</th>
                    <td class="text-right">{{ totales.base10.toFixed(2) }} €</td>
                    <th>IVA 10%:</th>
                    <td class="text-right">{{ totales.iva10.toFixed(2) }} €</td>
                  </tr>
                  <tr>
                    <th>Base IVA 4%:</th>
                    <td class="text-right">{{ totales.base4.toFixed(2) }} €</td>
                    <th>IVA 4%:</th>
                    <td class="text-right">{{ totales.iva4.toFixed(2) }} €</td>
                  </tr>
                  <tr class="bg-success text-success-content font-bold">
                    <th colspan="3" class="text-center">TOTAL FACTURA:</th>
                    <th class="text-right text-xl">{{ totales.total.toFixed(2) }} €</th>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="modal-action">
          <button type="button" class="btn" (click)="onCerrar()">Cerrar</button>
        </div>
      </div>
      <form method="dialog" class="modal-backdrop" (click)="onCerrar()">
        <button>close</button>
      </form>
    </dialog>
  `
})
export class ModalResumen {
  @Input() isOpen = false;
  @Input() datosCliente!: DatosCliente;
  @Input() lineas: LineaFacturaModel[] = [];
  @Input() totales!: TotalesFactura;
  @Output() cerrar = new EventEmitter<void>();

  onCerrar(): void {
    this.cerrar.emit();
  }
}
