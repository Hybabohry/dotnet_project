import { Injectable } from "@angular/core";
import { BehaviorSubject, map, Observable } from "rxjs";
import { UserResponse } from "../models/UserResponse";
import { TokenService } from "./token.service";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loggedIn = new BehaviorSubject<UserResponse | null>(null);
  loggedIn$ = this.loggedIn.asObservable();
  isLoggedIn$: Observable<boolean>;

  constructor(private tokenService: TokenService) {
    this.isLoggedIn$ = this.loggedIn$.pipe(
      map(user => !!user)
    );
    // Initialize from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        this.loggedIn.next(user);
      } catch (e) {
        console.error('Error parsing stored user:', e);
        localStorage.removeItem('user');
      }
    }
  }

  login(user: UserResponse) {
    this.loggedIn.next(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  logout() {
    this.loggedIn.next(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.loggedIn.value && !!this.tokenService.token;
  }

  isRhAdmin(): Observable<boolean> {
    return this.loggedIn$.pipe(
      map(user => {
        const isRh = !!user && user.UserType === 1;
        return isRh;
      })
    );
  }

  isCandidat(): Observable<boolean> {
    return this.loggedIn$.pipe(
      map(user => !!user && user.UserType === 0)
    );
  }

  isEmployeur(): Observable<boolean> {
    return this.loggedIn$.pipe(
      map(user => !!user && user.UserType === 2)
    );
  }
}
