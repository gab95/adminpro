import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen.pipe';

const pipes = [ImagenPipe];

@NgModule({
  declarations: pipes,
  exports: pipes,
})
export class PipesModule {}
