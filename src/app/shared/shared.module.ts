import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

const components = [BreadcrumbsComponent, SidebarComponent, HeaderComponent];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule, RouterModule],
})
export class SharedModule {}
