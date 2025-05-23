import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TokenService } from '../../services/services/token.service';
import { AuthService } from '../../services/services/auth.service';
import { UserResponse } from '../../services/models/UserResponse';
import { Observable } from 'rxjs';
import { LoginService } from '../../services/services/login.service';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    FormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private tokenService: TokenService,
    private loginService: LoginService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginModel = {
        email: this.loginForm.value.email,
        password: this.loginForm.value.password
      };
      this.authService.apiAuthLoginPost({ body: loginModel }).subscribe({
        next: (res: any) => {
          this.tokenService.token = res.Token as string;
          this.tokenService.user = res.user as UserResponse;
          localStorage.setItem('candidateId', res.user.Id);
          this.loginService.login(res.user);
          if (res.user.UserType === 0) {
            this.router.navigate(['/home']);
          } else if (res.user.UserType === 1) {
            this.router.navigate(['/JobOffers']);
          } 
        },
        error: (error) => {
          console.log('Login failed', error);
        }
      });
    }
  }
}
