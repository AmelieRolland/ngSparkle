

import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../auth.service';
import { IToken } from '../../../../../entities/auth';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
 selector: 'app-login',
 standalone: true,
 imports: [ReactiveFormsModule, CommonModule, RouterLink],
 templateUrl: './login.component.html',
 styleUrl: './login.component.css'
})

export class LoginComponent implements OnInit {
 loginForm: FormGroup = new FormGroup({});

 constructor(private authService: AuthService, private router: Router) { }

 ngOnInit() {
   this.loginForm = new FormGroup({
     credentials: new FormGroup({
       username: new FormControl('', [Validators.required, Validators.email]),
       password: new FormControl('', [Validators.required, Validators.minLength(2)])
     })
   });
 }

 onSubmit() {
   if (this.loginForm.valid) {
     const { username, password } = this.loginForm.value.credentials;
     this.authService.login({ username, password }).subscribe(
       (token) => {
         console.log('Token received:', token); 
         this.authService.saveToken(token.token);
         this.router.navigate(['/admin']); 
         console.log(username)
       },
       error => {
         console.error('Login failed', error);
       }
     );
   }
 }
}

