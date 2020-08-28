import { Component, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';
import { delay } from 'rxjs/operators';

import Swal from 'sweetalert2';

import { BusquedasService } from '../../../services/busquedas.service';
import { MedicoService } from '../../../services/medico.service';
import { ModalImagenService } from '../../../services/modal-imagen.service';

import { Medico } from '../../../models/medico.model';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [],
})
export class MedicosComponent implements OnInit {
  cargando: boolean = true;
  medicos: Medico[] = [];

  imgSubs: Subscription;

  constructor(
    private _medicoService: MedicoService,
    private _busquedasService: BusquedasService,
    private _modalImagenService: ModalImagenService
  ) {}

  ngOnInit(): void {
    this.cargarMedicos();

    this.imgSubs = this._modalImagenService.nuevaImagen
      .pipe(delay(150))
      .subscribe((img) => this.cargarMedicos());
  }

  buscar(termino: string) {
    if (termino.length === 0) {
      return this.cargarMedicos();
    }

    this._busquedasService.buscar('medicos', termino).subscribe((resp: any) => {
      this.medicos = resp;
    });
  }

  cargarMedicos() {
    this.cargando = true;
    this._medicoService.cargarMedicos().subscribe((medicos) => {
      this.medicos = medicos;
      this.cargando = false;
    });
  }

  actualizarMedico(medico: Medico) {
    this._medicoService.actualizarMedico(medico).subscribe((resp) => {
      Swal.fire('Medico Actualizado', medico.nombre, 'success');
    });
  }

  eliminarMedico(medico: Medico) {
    Swal.fire({
      title: 'Borrar Médico?',
      text: `Está a punto de borrar a ${medico.nombre}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Si, borrarlo',
    }).then((result) => {
      if (result.value) {
        this._medicoService.borrarMedico(medico._id).subscribe((resp) => {
          Swal.fire(
            'Usuario Eliminado!',
            `${medico.nombre} eliminado con éxito`,
            'success'
          );
          this.cargarMedicos();
        });
      }
    });
  }

  async abrirSweetAlert() {
    const { value = '' } = await Swal.fire<string>({
      title: 'Crear Medico',
      text: 'Ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'Nombre del Medico',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'El nombre no puede ser vacío';
        }
      },
    });

    // if (value.trim().length > 0) {
    //   this._medicoService.crearMedico(value).subscribe(
    //     (resp: any) => this.medicos.push(resp.hospital),
    //     (err) => Swal.fire('Error', err.error.msg, 'error')
    //   );
    // }
  }

  abrirModal(medico: Medico) {
    this._modalImagenService.abrirModal('medicos', medico._id, medico.img);
  }

  ngOnDestroy() {
    this.imgSubs.unsubscribe();
  }
}
