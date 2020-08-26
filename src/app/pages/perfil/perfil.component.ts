import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { UsuarioService } from '../../services/usuario.service';

import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [],
})
export class PerfilComponent implements OnInit {
  usuario: Usuario;
  perfilForm: FormGroup;
  imagenSubir: File;
  imgTemp: any;

  constructor(
    private fb: FormBuilder,
    private _usuarioService: UsuarioService,
    private _fileUploadService: FileUploadService
  ) {
    this.usuario = _usuarioService.usuario;
  }

  ngOnInit(): void {
    this.perfilForm = this.fb.group({
      nombre: [this.usuario.nombre, Validators.required],
      email: [this.usuario.email, [Validators.required, Validators.email]],
    });
  }

  actualizarPerfil() {
    console.log(this.perfilForm.value);
    this._usuarioService.actualizarPerfil(this.perfilForm.value).subscribe(
      () => {
        const { nombre, email } = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;
        Swal.fire('Guardado', 'Cambios guardados exitosamente', 'success');
      },
      (err) => {
        console.log(err);
        Swal.fire('Error', err.error.msg, 'error');
      }
    );
  }

  cambiarImagen(file: File) {
    this.imagenSubir = file;

    if (!file) {
      return (this.imgTemp = null);
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    };
  }

  subirImagen() {
    this._fileUploadService
      .actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid)
      .then((img) => {
        this.usuario.img = img;
        Swal.fire('Guardado', 'Imagen subida exitosamente', 'success');
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('Error', err.error.msg, 'error');
      });
  }
}
