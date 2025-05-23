import { Injectable } from '@angular/core';
import { UserResponse } from '../models/UserResponse';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  set token(token: string) {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }

  get token(): string | null {
    return localStorage.getItem('token');
  }

  set user(user: UserResponse | null) {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }

  get user(): UserResponse | null {
    const userStr = localStorage.getItem('user');
    if (!userStr) return null;
    try {
      return JSON.parse(userStr);
    } catch (e) {
      console.error('Error parsing user data:', e);
      return null;
    }
  }

  loadUserFromToken(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const userType = localStorage.getItem('userType');
      // Convert userType to number, default to 0 (CANDIDATE) if not found
      const userTypeNum = userType ? parseInt(userType, 10) : 0;
      this.user = { UserType: userTypeNum };
    } else {
      this.user = null;
    }
  }

  clear(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('userType');
  }
}