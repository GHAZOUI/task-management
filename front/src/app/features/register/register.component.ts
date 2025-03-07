import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private authService: AuthService, 
    private router: Router, 
    private fb: FormBuilder, 
    private http: HttpClient) 
    {
      this.registerForm = this.fb.group({
        username: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]]
      });
    }

  onSubmit() {
    if (this.registerForm.valid) {
      const userData = this.registerForm.value;

      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/home']);
        },
        error: (error: any) => {
          this.errorMessage = 'Erreur lors de l’inscription. Réessayez.';
          this.successMessage = '';
          console.error('Erreur:', error);
        }
      });
      // this.http.post('api/auth/register', userData).subscribe({
      //   next: () => {
      //     this.successMessage = 'Inscription réussie !';
      //     this.errorMessage = '';
      //     this.registerForm.reset();
      //   },
      //   error: (error) => {
      //     this.errorMessage = 'Erreur lors de l’inscription. Réessayez.';
      //     this.successMessage = '';
      //     console.error('Erreur:', error);
      //   }
      // });
    }
  }
}
