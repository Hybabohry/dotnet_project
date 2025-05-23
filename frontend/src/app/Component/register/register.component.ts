import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/services';
import { Competence, RegisterModel } from '../../services/models';
import { HttpClient } from '@angular/common/http';
import { TokenService } from '../../services/services/token.service';
import { UserResponse } from '../../services/models/UserResponse';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, CommonModule,RouterLink],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  competences: Competence[] = [];

  constructor(
    private fb: FormBuilder,
    private registerService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private tokenService: TokenService
  ) {
    this.registerForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
      telephone: ['', Validators.required],
      cvFile: [null],
      competences: [[]]
    }, { validators: this.passwordMatchValidator });
  }

  passwordMatchValidator(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      // PDF only
      if (file.type !== 'application/pdf') {
        alert('Please upload a PDF file.');
        input.value = '';
        return;
      }
      this.registerForm.patchValue({ cvFile: file });
    }
  }

  ngOnInit() {
    this.route.data.subscribe(data => {
      this.competences = data['competences'] || [];
      console.log('Resolved competences:', this.competences);
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const formValue = this.registerForm.value;

      // Convert CV file to base64 if it exists
      if (formValue.cvFile) {
        const reader = new FileReader();
        reader.onload = () => {
          const base64String = reader.result as string;
          const registerModel: RegisterModel = {
            firstname: formValue.firstname,
            lastname: formValue.lastname,
            email: formValue.email,
            password: formValue.password,
            telephone: formValue.telephone,
            competences: formValue.competences,
            cvBase64: base64String
          };
          console.log('RegisterModel:', registerModel);
          this.registerService.apiAuthRegisterPost({ body: registerModel }).subscribe({
            next: (res: any) => {
              console.log('Registration successful:', res);
              this.tokenService.token = res.Token as string;
              this.tokenService.user = res.user as UserResponse;
              this.router.navigate(['/home']);
            },
            error: (err:any) => {
              console.error('Registration failed:', err);
              alert('Registration failed. Please try again.');
            }
          });
        };
        reader.readAsDataURL(formValue.cvFile);
      } else {
        // If no CV file, send without it
        const registerModel: RegisterModel = {
          firstname: formValue.firstname,
          lastname: formValue.lastname,
          email: formValue.email,
          password: formValue.password,
          telephone: formValue.telephone,
          competences: formValue.competences
        };
        console.log('RegisterModel:', registerModel);
        this.registerService.apiAuthRegisterPost({ body: registerModel }).subscribe({
          next: (res: any) => {
            console.log('Registration successful:', res);
            this.tokenService.token = res.Token as string;
            this.tokenService.user = res.user as UserResponse;
            this.router.navigate(['/home']);
          },
          error: (err:any) => {
            console.error('Registration failed:', err);
            alert('Registration failed. Please try again.');
          }
        });
      }
    }
  }
}
