import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import {
  LoginUserDTO,
  RegisterUserDTO,
  User,
} from '../../../core/model/user.model';
import { environment } from '../../../../environments/environment.development';
import { Observable, tap } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly lsService = inject(LocalStorageService);

  readonly user = this.lsService.user;

  readonly isAuthenticated = computed(() => !!this.lsService.user());

  login(objLogin: LoginUserDTO): Observable<User> {
    return this.http.post<User>(`${environment.BASE_URL}login`, objLogin).pipe(
      tap((user) => {
        this.lsService.setUser(user);
      }),
    );
  }

  loggout() {
    this.lsService.setUser(null);
  }

  register(objRegister: RegisterUserDTO): Observable<User> {
    return this.http.post<User>(`${environment.BASE_URL}register`, objRegister);
  }
}
