import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Factura, LineaFacturaModel, TotalesFactura, DatosCliente } from '../../services/factura';
import { Validation } from '../../services/validation';
import { LineaFactura } from '../linea-factura/linea-factura';
import { ModalResumen } from '../modal-resumen/modal-resumen';
import { ModalErrores } from '../modal-errores/modal-errores';

@Component({
  selector: 'app-factura-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LineaFactura,
    ModalResumen,
    ModalErrores
  ],
  templateUrl: './factura-form.html'
})
export class FacturaForm implements OnInit {
  facturaForm!: FormGroup;
  lineas: LineaFacturaModel[] = [];
  totales!: TotalesFactura;

  // Captcha
  num1 = 0;
  num2 = 0;
  resultadoCaptcha = 0;

  // Modales
  mostrarModalResumen = false;
  mostrarModalErrores = false;
  erroresValidacion: string[] = [];

  constructor(
    private fb: FormBuilder,
    public facturaService: Factura,
    public validationService: Validation
  ) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.suscribirALineas();
    this.suscribirATotales();
    this.generarCaptcha();

    // Auto-llenar provincia al cambiar CP
    this.facturaForm.get('cp')?.valueChanges.subscribe(cp => {
      if (this.validationService.isCP(cp)) {
        const provincia = this.validationService.getProvinciaByCP(cp);
        this.facturaForm.patchValue({ provincia }, { emitEvent: false });
      } else {
        this.facturaForm.patchValue({ provincia: '' }, { emitEvent: false });
      }
    });
  }

  inicializarFormulario(): void {
    this.facturaForm = this.fb.group({
      numero: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(7)]],
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(200)]],
      fecha: ['', [Validators.required, this.validationService.dateValidator()]],
      cp: ['', [Validators.required, this.validationService.cpValidator()]],
      provincia: [{ value: '', disabled: true }],
      localidad: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      documento: ['', [Validators.required, this.validationService.documentoValidator()]],
      telefono: ['', [Validators.required, this.validationService.telefonoValidator()]],
      email: ['', [Validators.required, Validators.email]],
      captcha: ['', Validators.required]
    });
  }

  suscribirALineas(): void {
    this.facturaService.lineas$.subscribe(lineas => {
      this.lineas = lineas;
    });
  }

  suscribirATotales(): void {
    this.facturaService.totales$.subscribe(totales => {
      this.totales = totales;
    });
  }

  generarCaptcha(): void {
    this.num1 = Math.floor(Math.random() * 10);
    this.num2 = Math.floor(Math.random() * 10);
    this.resultadoCaptcha = this.num1 + this.num2;
    this.facturaForm.patchValue({ captcha: '' });
  }

  validarCaptcha(): boolean {
    const valorIngresado = parseInt(this.facturaForm.get('captcha')?.value, 10);
    return valorIngresado === this.resultadoCaptcha;
  }

  agregarLinea(): void {
    // Validar la última línea antes de agregar una nueva
    const ultimaLinea = this.lineas[this.lineas.length - 1];
    if (ultimaLinea && (!ultimaLinea.descripcion || ultimaLinea.cantidad <= 0)) {
      alert('Por favor, completa correctamente la línea actual antes de añadir una nueva.');
      return;
    }
    this.facturaService.agregarLinea();
  }

  eliminarLinea(id: number): void {
    this.facturaService.eliminarLinea(id);
  }

  validarFormulario(): string[] {
    const errores: string[] = [];

    // Validar campos del formulario
    if (this.facturaForm.get('numero')?.invalid) {
      errores.push('Número de factura inválido (1-7 caracteres)');
    }
    if (this.facturaForm.get('nombre')?.invalid) {
      errores.push('Nombre inválido (2-200 caracteres)');
    }
    if (this.facturaForm.get('fecha')?.invalid) {
      errores.push('Fecha inválida (formato DD/MM/YYYY, no puede ser posterior a hoy)');
    }
    if (this.facturaForm.get('cp')?.invalid) {
      errores.push('Código postal inválido');
    }
    if (this.facturaForm.get('localidad')?.invalid) {
      errores.push('Localidad inválida (2-20 caracteres)');
    }
    if (this.facturaForm.get('documento')?.invalid) {
      errores.push('Documento de identidad inválido (DNI/NIE/CIF)');
    }
    if (this.facturaForm.get('telefono')?.invalid) {
      errores.push('Teléfono inválido (9 dígitos, empieza por 6, 7 o 9)');
    }
    if (this.facturaForm.get('email')?.invalid) {
      errores.push('Email inválido');
    }

    // Validar captcha
    if (!this.validarCaptcha()) {
      errores.push('Captcha incorrecto');
    }

    // Validar líneas de factura
    const lineasValidas = this.lineas.filter(l =>
      l.cantidad > 0 && l.descripcion.trim().length > 0 && l.precio >= 0
    );

    if (lineasValidas.length === 0) {
      errores.push('Debe haber al menos una línea de factura válida');
    }

    return errores;
  }

  onSubmit(): void {
    // Marcar todos los campos como tocados para mostrar errores
    Object.keys(this.facturaForm.controls).forEach(key => {
      this.facturaForm.get(key)?.markAsTouched();
    });

    const errores = this.validarFormulario();

    if (errores.length > 0) {
      this.erroresValidacion = errores;
      this.mostrarModalErrores = true;
      this.generarCaptcha(); // Regenerar captcha en caso de error
      return;
    }

    // Todo OK - Mostrar resumen
    this.mostrarModalResumen = true;
  }

  cerrarModalResumen(): void {
    this.mostrarModalResumen = false;
  }

  cerrarModalErrores(): void {
    this.mostrarModalErrores = false;
  }

  get datosCliente(): DatosCliente {
    const formValue = this.facturaForm.value;
    return {
      numero: formValue.numero,
      nombre: formValue.nombre,
      fecha: formValue.fecha,
      cp: formValue.cp,
      provincia: this.validationService.getProvinciaByCP(formValue.cp),
      localidad: formValue.localidad,
      documento: formValue.documento,
      telefono: formValue.telefono,
      email: formValue.email
    };
  }
  trackByIndex(index: number): number {
    return index;
  }
}
