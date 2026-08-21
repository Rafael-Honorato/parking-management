import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButton } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButton,
    MatProgressSpinnerModule,
    RouterLink,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private readonly _authService = inject(AuthService);
  private readonly _fb = inject(FormBuilder);
  protected readonly _isLoading = signal(false);
  private readonly _snackBar = inject(MatSnackBar);
  protected readonly _hide = signal(false);

  protected readonly _form: FormGroup = this._fb.nonNullable.group({
    emailId: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.min(6)]],
    fullName: ['', Validators.required],
    mobileNo: ['', Validators.required],
  });

  onRegister() {
    if (this._form.invalid) {
      this._form.markAllAsTouched();
      return;
    }
    this._isLoading.set(true);
    this._authService.register(this._form.value).subscribe({
      next: (user) => {
        this.mensagemUser(true);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.log(err);
        this.mensagemUser(false);
        this._isLoading.set(false);
      },
    });
  }

  mensagemUser(success: boolean) {
    if (success) {
      this._snackBar.open('Cadastrado com sucesso!', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    } else {
      this._snackBar.open('Erro ao cadastrar!', 'Fechar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      });
    }
  }
}
