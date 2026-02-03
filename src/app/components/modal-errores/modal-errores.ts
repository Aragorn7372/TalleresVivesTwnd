import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal-errores',
  standalone: true,
  imports: [CommonModule],
  template: `
    <dialog #modal class="modal" [class.modal-open]="isOpen">
      <div class="modal-box bg-base-100 border-2 border-error">
        <div class="bg-error text-error-content p-4 rounded-t-lg -m-6 mb-4">
          <h3 class="font-bold text-lg">
            <span class="text-2xl">⚠️</span> Errores de Validación
          </h3>
        </div>

        <p class="text-warning font-bold mb-4">
          Por favor, corrige los siguientes errores antes de enviar la factura:
        </p>

        <ul class="space-y-2">
          <li *ngFor="let error of errores"
              class="alert alert-error py-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{{ error }}</span>
          </li>
        </ul>

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
export class ModalErrores {
  @Input() isOpen = false;
  @Input() errores: string[] = [];
  @Output() cerrar = new EventEmitter<void>();

  onCerrar(): void {
    this.cerrar.emit();
  }
}
