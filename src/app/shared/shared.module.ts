import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';

const components = [BreadcrumbsComponent, SidebarComponent, HeaderComponent];

@NgModule({
  declarations: components,
  exports: components,
  imports: [CommonModule],
})
export class SharedModule {}
