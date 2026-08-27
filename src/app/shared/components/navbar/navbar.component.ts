import { Component, inject, output, signal } from '@angular/core';
import { LogoBrandComponent } from '../logo-brand/logo-brand.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '@app/features/auth/services/auth.service';

@Component({
  selector: 'app-navbar',
  imports: [LogoBrandComponent, RouterLinkActive, RouterLink],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fnToggle = output<boolean>();
  toggle = signal<boolean>(false);

  onToggle() {
    this.toggle.update((m) => !m);
    this.fnToggle.emit(this.toggle());
  }

  onSair() {
    this.authService.loggout();
    this.router.navigate(['/auth/login']);
  }
}
