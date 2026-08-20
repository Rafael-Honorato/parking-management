import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginUserDTO, RegisterUserDTO, User } from '../model/user.model';
import { environment } from '../../../environments/environment.development';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);

  login(objLogin: LoginUserDTO): Observable<User> {
    return this.http.post<User>(`${environment.BASE_URL}login`, objLogin);
  }

  register(objRegister: RegisterUserDTO): Observable<User> {
    return this.http.post<User>(`${environment.BASE_URL}register`, objRegister);
  }
}
