

import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { userInfo } from 'os';
import { IUser } from '../../../../../entities/entities';
import { RedirectService } from '../../../../redirect.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});

  constructor(private authService: AuthService, private router: Router, private redirectService: RedirectService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      credentials: new FormGroup({
        username: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [Validators.required, Validators.minLength(4)])
      })
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value.credentials;
      this.authService.login({ username, password }).subscribe(
        (token) => {
          this.authService.saveToken(token.token);

          const user = this.authService.getUserInfo();
          if (user?.roles?.includes('ROLE_ADMIN')) {
            this.router.navigate(['/admin']);
          } else {
            const redirectUrl = this.redirectService.getRedirectUrl();
            if (redirectUrl) {
              this.router.navigate([redirectUrl]);
              this.redirectService.clearRedirectUrl();
            } else {
              this.router.navigate(['/mon-compte']);
            }
          }
        },
        error => {
          console.error('Login failed', error);
        }
      );
    }
  }


}

