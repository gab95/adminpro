import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HospitalService } from '../../../../services/hospital.service';
import { Hospital } from '../../../../models/hospital.model';
import { MedicoService } from '../../../../services/medico.service';
import { Medico } from '../../../../models/medico.model';
import Swal from 'sweetalert2';
import { Router, ActivatedRoute } from '@angular/router';
import { delay } from 'rxjs/operators';

@Component({
  selector: 'app-medico',
  templateUrl: './medico.component.html',
  styles: [],
})
export class MedicoComponent implements OnInit {
  medicoForm: FormGroup;

  hospitales: Hospital[] = [];

  hospitalSeleccionado: Hospital;
  medicoSeleccionado: Medico;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private _hospitalService: HospitalService,
    private _medicoService: MedicoService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(({ id }) => this.cargarMedico(id));

    this.medicoForm = this.fb.group({
      nombre: ['', Validators.required],
      hospital: ['', Validators.required],
    });

    this.cargarHospitales();

    this.medicoForm.get('hospital').valueChanges.subscribe((hospitalId) => {
      this.hospitalSeleccionado = this.hospitales.find(
        (h) => h._id === hospitalId
      );
    });
  }

  cargarHospitales() {
    this._hospitalService
      .cargarHospitales()
      .subscribe((hospitales: Hospital[]) => {
        this.hospitales = hospitales;
      });
  }

  cargarMedico(id: string) {
    if (id === 'nuevo') {
      return;
    }

    this._medicoService
      .obtenerMedicoPorId(id)
      .pipe(delay(100))
      .subscribe(
        (medico) => {
          const {
            nombre,
            hospital: { _id },
          } = medico;

          this.medicoSeleccionado = medico;

          this.medicoForm.setValue({ nombre, hospital: _id });
        },
        (err) => this.router.navigateByUrl('/dashboard/medicos')
      );
  }

  guardarMedico() {
    const { nombre } = this.medicoForm.value;

    if (this.medicoSeleccionado) {
      const data = {
        ...this.medicoForm.value,
        _id: this.medicoSeleccionado._id,
      };
      this._medicoService.actualizarMedico(data).subscribe((resp: any) => {
        Swal.fire(
          'Médico Actualizado',
          `${nombre} actualizado exitosamente`,
          'success'
        );
      });
    } else {
      this._medicoService
        .crearMedico(this.medicoForm.value)
        .subscribe((resp: any) => {
          Swal.fire(
            'Médico Creado',
            `${nombre} creado exitosamente`,
            'success'
          );
          this.router.navigate(['/dashboard/medico', resp.medico._id]);
        });
    }
  }
}
