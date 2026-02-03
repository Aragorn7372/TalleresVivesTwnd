import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface LineaFacturaModel {
  id: number;
  cantidad: number;
  descripcion: string;
  precio: number;
  iva: number;
  importeIva: number;
  importe: number;
  total: number;
}

export interface TotalesFactura {
  base21: number;
  base10: number;
  base4: number;
  iva21: number;
  iva10: number;
  iva4: number;
  total: number;
}

export interface DatosCliente {
  numero: string;
  nombre: string;
  fecha: string;
  cp: string;
  provincia: string;
  localidad: string;
  documento: string;
  telefono: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class Factura {
  private lineasSubject = new BehaviorSubject<LineaFacturaModel[]>([]);
  public lineas$ = this.lineasSubject.asObservable();

  private totalesSubject = new BehaviorSubject<TotalesFactura>({
    base21: 0, base10: 0, base4: 0,
    iva21: 0, iva10: 0, iva4: 0,
    total: 0
  });
  public totales$ = this.totalesSubject.asObservable();

  private idCounter = 0;

  constructor() {
    // Inicializar con una línea
    this.agregarLinea();
  }

  agregarLinea(): void {
    const lineas = this.lineasSubject.value;
    const nuevaLinea: LineaFacturaModel = {
      id: this.idCounter++,
      cantidad: 1,
      descripcion: '',
      precio: 0,
      iva: 21,
      importeIva: 0,
      importe: 0,
      total: 0
    };

    this.lineasSubject.next([...lineas, nuevaLinea]);
  }

  eliminarLinea(id: number): void {
    const lineas = this.lineasSubject.value.filter(l => l.id !== id);
    this.lineasSubject.next(lineas);
    this.calcularTotales();
  }

  actualizarLinea(linea: LineaFacturaModel): void {
    const lineas = this.lineasSubject.value.map(l =>
      l.id === linea.id ? linea : l
    );
    this.lineasSubject.next(lineas);
    this.calcularTotales();
  }

  calcularLineaTotal(linea: Partial<LineaFacturaModel>): LineaFacturaModel {
    const cantidad = linea.cantidad || 0;
    const precio = linea.precio || 0;
    const iva = linea.iva || 21;

    const importe = cantidad * precio;
    const importeIva = importe * (iva / 100);
    const total = importe + importeIva;

    return {
      ...linea,
      cantidad,
      precio,
      iva,
      importe,
      importeIva,
      total
    } as LineaFacturaModel;
  }

  private calcularTotales(): void {
    const lineas = this.lineasSubject.value;

    let base21 = 0, base10 = 0, base4 = 0;
    let iva21 = 0, iva10 = 0, iva4 = 0;

    lineas.forEach(linea => {
      switch (linea.iva) {
        case 21:
          base21 += linea.importe;
          iva21 += linea.importeIva;
          break;
        case 10:
          base10 += linea.importe;
          iva10 += linea.importeIva;
          break;
        case 4:
          base4 += linea.importe;
          iva4 += linea.importeIva;
          break;
      }
    });

    const total = base21 + base10 + base4 + iva21 + iva10 + iva4;

    this.totalesSubject.next({
      base21, base10, base4,
      iva21, iva10, iva4,
      total
    });
  }

  getLineas(): LineaFacturaModel[] {
    return this.lineasSubject.value;
  }

  getTotales(): TotalesFactura {
    return this.totalesSubject.value;
  }

  reset(): void {
    this.idCounter = 0;
    this.lineasSubject.next([]);
    this.agregarLinea();
  }
}
