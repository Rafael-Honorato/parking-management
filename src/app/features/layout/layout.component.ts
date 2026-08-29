import { Component, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@app/shared/components/navbar/navbar.component';
import { MatButtonModule } from '@angular/material/button';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-layout-bkp',
  imports: [RouterOutlet, NavbarComponent, MatSidenavModule, MatButtonModule],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  menuAberto = signal(false);

  onToggleMenu(estaAberto: boolean) {
    this.menuAberto.set(estaAberto);
    //console.log('O menu está: ', this.menuAberto() ? 'aberto' : 'fechado');
  }
}
