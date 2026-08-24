import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@app/features/auth/services/auth.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router, RouterLink } from '@angular/router';
import { LoginUserDTO } from '@app/core/model/user.model';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButton,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly router = inject(Router);
  protected isLoading = signal(false);
  protected hide = signal(true);
  protected messageError = signal('');

  form: FormGroup = this.fb.nonNullable.group({
    emailId: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  ngOnInit(): void {
    if (this.userService.user()) {
      this.router.navigate(['/dashboard']);
    }
  }

  onLogin() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    const loginObj = {
      emailId: this.form.value.emailId,
      password: this.form.value.password,
    };

    console.log('Enviando...', loginObj);

    this.userService.login(loginObj).subscribe({
      next: (user) => {
        this.isLoading.set(false);
        this.mensagemUser(true);
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.mensagemUser(false, err);
      },
    });
  }

  mensagemUser(success: boolean = false, err: string = '') {
    const message = success
      ? 'Login redalizdo com sucesso!!!'
      : 'Erro ao fazer login';

    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top',
    });
  }

  clickEvent(event: MouseEvent) {
    console.log('teste');
    this.hide.update((m) => !m);
    event.stopPropagation();
  }
}
