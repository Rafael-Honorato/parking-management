import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { AuthService } from './features/auth/services/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  menuAberto = signal(false);
  authService = inject(AuthService);

  onToggleMenu(estaAberto: boolean) {
    this.menuAberto.set(estaAberto);
    //console.log('O menu está: ', this.menuAberto() ? 'aberto' : 'fechado');
  }
}
