import { Component } from '@angular/core';
import { FacturaForm } from './components/factura-form/factura-form';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FacturaForm],
  template: `<app-factura-form></app-factura-form>`
})
export class App {
  title = 'talleres-vives-angular';
}
