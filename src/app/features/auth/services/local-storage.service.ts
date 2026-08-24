import { Injectable, signal } from '@angular/core';
import { User } from '@app/core/model/user.model';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  private readonly STORAGE_KEY = 'userParking';

  private readonly _user = signal<User | null>(this.getUserFromStorage());

  readonly user = this._user.asReadonly();

  setUser(user: User | null): void {
    this._user.set(user);

    if (user) {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.STORAGE_KEY);
    }
  }

  private getUserFromStorage(): User | null {
    const ls = localStorage.getItem(this.STORAGE_KEY);
    if (!ls) return null;

    try {
      return JSON.parse(ls) as User;
    } catch {
      return null;
    }
  }
}
