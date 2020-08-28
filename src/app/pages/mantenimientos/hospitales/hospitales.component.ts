import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { BusquedasService } from '../../../services/busquedas.service';
import { HospitalService } from '../../../services/hospital.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import { Hospital } from '../../../models/hospital.model';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [],
})
export class HospitalesComponent implements OnInit, OnDestroy {
  cargando: boolean = true;
  hospitales: Hospital[] = [];

  imgSubs: Subscription;

  constructor(
    private _hospitalService: HospitalService,
    private _busquedasService: BusquedasService,
    private _modalImagenService: ModalImagenService
  ) {}

  ngOnInit(): void {
    this.cargarHospitales();

    this.imgSubs = this._modalImagenService.nuevaImagen
      .pipe(delay(150))
      .subscribe((img) => this.cargarHospitales());
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.cargarHospitales();
    }

    this._busquedasService
      .buscar('hospitales', termino)
      .subscribe((resp: any) => {
        this.hospitales = resp;
      });
  }

  cargarHospitales() {
    this.cargando = true;
    this._hospitalService.cargarHospitales().subscribe((hospitales) => {
      this.hospitales = hospitales;
      this.cargando = false;
    });
  }

  actualizarHospital(hospital: Hospital) {
    this._hospitalService
      .actualizarHospital(hospital._id, hospital.nombre)
      .subscribe((resp) => {
        Swal.fire('Hospital Actualizado', hospital.nombre, 'success');
      });
  }

  eliminarHospital(hospital: Hospital) {
    this._hospitalService.borrarHospital(hospital._id).subscribe((resp) => {
      this.cargarHospitales();
      Swal.fire('Hospital Eliminado', hospital.nombre, 'success');
    });
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del Hospital',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'El nombre no puede ser vacío';
        }
      },
    });

    if (value.trim().length > 0) {
      this._hospitalService.crearHospital(value).subscribe(
        (resp: any) => this.hospitales.push(resp.hospital),
        (err) => Swal.fire('Error', err.error.msg, 'error')
      );
    }
  }

  abrirModal(hospital: Hospital) {
    this._modalImagenService.abrirModal(
      'hospitales',
      hospital._id,
      hospital.img
    );
  }

  ngOnDestroy() {
    this.imgSubs.unsubscribe();
  }
}
