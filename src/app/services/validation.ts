import { Injectable } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class Validation {

  // Validar DNI
  isDni(value: string): boolean {
    if (!value || value.length !== 9) return false;

    const numero = value.substring(0, 8);
    const letra = value.charAt(8).toUpperCase();

    if (!/^\d{8}$/.test(numero)) return false;

    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const letraEsperada = letras[parseInt(numero) % 23];

    return letra === letraEsperada;
  }

  // Validar NIE
  isNie(value: string): boolean {
    if (!value || !/^[XYZ]\d{7}[A-Z]$/.test(value.toUpperCase())) return false;

    const reemplazo: { [key: string]: string } = { X: "0", Y: "1", Z: "2" };
    const nieNum = value.toUpperCase().replace(/^[XYZ]/, letra => reemplazo[letra]);

    const letras = "TRWAGMYFPDXBNJZSQVHLCKE";
    const numero = parseInt(nieNum.slice(0, 8), 10);
    const letraEsperada = letras[numero % 23];

    return letraEsperada === value.charAt(8).toUpperCase();
  }

  // Validar CIF
  isCif(value: string): boolean {
    const cif = value.toUpperCase().trim();

    if (!/^[ABCDEFGHJKLMNPQRSUVW]\d{7}[0-9A-J]$/.test(cif)) return false;

    const letraInicial = cif.charAt(0);
    const numeros = cif.substring(1, 8);
    const control = cif.charAt(8);

    let sumaPar = 0;
    let sumaImpar = 0;

    for (let i = 0; i < 7; i++) {
      const n = parseInt(numeros.charAt(i), 10);

      if (i % 2 === 0) {
        let doble = n * 2;
        sumaImpar += Math.floor(doble / 10) + (doble % 10);
      } else {
        sumaPar += n;
      }
    }

    const total = sumaPar + sumaImpar;
    const digitoControl = (10 - (total % 10)) % 10;
    const letraControl = "JABCDEFGHI".charAt(digitoControl);

    const letrasConDigito = "ABEH";
    const letrasConLetra = "KPQS";

    if (letrasConDigito.includes(letraInicial)) {
      return control === String(digitoControl);
    } else if (letrasConLetra.includes(letraInicial)) {
      return control === letraControl;
    } else {
      return control === String(digitoControl) || control === letraControl;
    }
  }

  // Validar teléfono
  isTelefono(value: string): boolean {
    if (!value || value.length !== 9) return false;

    const primerDigito = value.charAt(0);
    return /^\d{9}$/.test(value) && ['6', '7', '9'].includes(primerDigito);
  }

  // Validar código postal
  isCP(value: string): boolean {
    if (!value || !/^\d{5}$/.test(value.trim())) return false;

    const num = parseInt(value, 10);
    return num >= 1000 && num <= 52999;
  }

  // Validar fecha (no posterior a hoy)
  isDate(value: string): boolean {
    if (!value || value.length !== 10) return false;

    const partes = value.split("/");
    if (partes.length !== 3) return false;

    const dia = parseInt(partes[0], 10);
    const mes = parseInt(partes[1], 10);
    const año = parseInt(partes[2], 10);

    if (dia <= 0 || dia > 31 || mes <= 0 || mes > 12) return false;

    const fechaIntroducida = new Date(año, mes - 1, dia);
    const hoy = new Date();

    hoy.setHours(0, 0, 0, 0);
    fechaIntroducida.setHours(0, 0, 0, 0);

    if (fechaIntroducida.getDate() !== dia ||
      fechaIntroducida.getMonth() !== mes - 1 ||
      fechaIntroducida.getFullYear() !== año) {
      return false;
    }

    return fechaIntroducida <= hoy;
  }

  // Obtener provincia por CP
  getProvinciaByCP(cp: string): string {
    const provincias: { [key: string]: string } = {
      '01': 'Álava', '02': 'Albacete', '03': 'Alicante', '04': 'Almería',
      '05': 'Ávila', '06': 'Badajoz', '07': 'Islas Baleares', '08': 'Barcelona',
      '09': 'Burgos', '10': 'Cáceres', '11': 'Cádiz', '12': 'Castellón',
      '13': 'Ciudad Real', '14': 'Córdoba', '15': 'A Coruña', '16': 'Cuenca',
      '17': 'Girona', '18': 'Granada', '19': 'Guadalajara', '20': 'Gipuzkoa',
      '21': 'Huelva', '22': 'Huesca', '23': 'Jaén', '24': 'León',
      '25': 'Lleida', '26': 'La Rioja', '27': 'Lugo', '28': 'Madrid',
      '29': 'Málaga', '30': 'Murcia', '31': 'Navarra', '32': 'Ourense',
      '33': 'Asturias', '34': 'Palencia', '35': 'Las Palmas', '36': 'Pontevedra',
      '37': 'Salamanca', '38': 'Santa Cruz de Tenerife', '39': 'Cantabria',
      '40': 'Segovia', '41': 'Sevilla', '42': 'Soria', '43': 'Tarragona',
      '44': 'Teruel', '45': 'Toledo', '46': 'Valencia', '47': 'Valladolid',
      '48': 'Bizkaia', '49': 'Zamora', '50': 'Zaragoza', '51': 'Ceuta',
      '52': 'Melilla'
    };

    const codigo = cp.substring(0, 2);
    return provincias[codigo] || '';
  }

  // Validators para Reactive Forms
  documentoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const valid = this.isDni(value) || this.isNie(value) || this.isCif(value);
      return valid ? null : { documento: true };
    };
  }

  telefonoValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      return this.isTelefono(value) ? null : { telefono: true };
    };
  }

  cpValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      return this.isCP(value) ? null : { cp: true };
    };
  }

  dateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      return this.isDate(value) ? null : { date: true };
    };
  }
}
