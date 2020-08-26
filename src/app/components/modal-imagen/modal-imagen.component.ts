import { Component, OnInit } from '@angular/core';
import { ModalImagenService } from '../../services/modal-imagen.service';
import { Usuario } from '../../models/usuario.model';
import { FileUploadService } from '../../services/file-upload.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styleUrls: ['./modal-imagen.component.css'],
})
export class ModalImagenComponent implements OnInit {
  imagenSubir: File;
  imgTemp: any;

  constructor(
    public _modalImagenService: ModalImagenService,
    public _fileUploadService: FileUploadService
  ) {}

  ngOnInit(): void {}

  cerrarModal() {
    this.imgTemp = null;
    this._modalImagenService.cerrarModal();
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
    const id = this._modalImagenService.id;
    const tipo = this._modalImagenService.tipo;

    this._fileUploadService
      .actualizarFoto(this.imagenSubir, tipo, id)
      .then((img) => {
        Swal.fire('Guardado', 'Imagen subida exitosamente', 'success');
        this._modalImagenService.nuevaImagen.emit(img);
        this.cerrarModal();
      })
      .catch((err) => {
        console.log(err);
        Swal.fire('Error', err.error.msg, 'error');
      });
  }
}
