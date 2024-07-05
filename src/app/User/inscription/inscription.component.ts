import { Component, inject } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Gender } from '../../shared/entities/entities';
import { GenderService } from '../../shared/services/gender.service';
import { Router } from '@angular/router';
import { AuthService } from '../../shared/services/auth/auth.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {

  constructor(private router: Router, private authService: AuthService) { }


  genders: Gender[] = [];

  service = inject(UserService);
  genderService = inject(GenderService);

  public loginForm:FormGroup = new FormGroup ({
    gender: new FormControl,
    name: new FormControl,
    surname: new FormControl,
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
    confirmPassword: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.minLength(8), Validators.maxLength(20)]),
    birthday: new FormControl('', [Validators.required]),
    direction: new FormControl,
    registration_date: new FormControl


    
  })

  ngOnInit() {
    this.genderService.getGenders().subscribe({
      next: (genders) => this.genders = genders,
      error: (error) => console.error('Erreur lors de la récupération des données', error)
    });
  }

  onSubmit() {
    console.log(this.loginForm.value);
    if (this.loginForm.valid) {
      if (this.loginForm.get('password')?.value !== this.loginForm.get('confirmPassword')?.value) {
        console.log('Les mots de passe ne correspondent pas');
        return;
      }
      this.loginForm.patchValue({ registration_date: new Date() });
      this.service.register(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Inscription réussie', response);

          //connexion auto :
          this.authService.login({ username: this.loginForm.get('email')?.value, password: this.loginForm.get('password')?.value }).subscribe({
            next: (loginResponse) => {
              console.log('Connectée', loginResponse);
              this.router.navigate(['/user-account']);
            },
            error: (loginError) => {
              console.error('Erreur de connexion', loginError);
            }
          });

        },
        error: (error) => {
          console.error('Erreur inscription', error);
          console.log(this.loginForm.value);
        }
      });
    } else {
      console.log('Formulaire invalide');
    }
  }
}