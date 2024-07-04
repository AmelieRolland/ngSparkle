import { Component, inject } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Gender } from '../../shared/entities/entities';
import { GenderService } from '../../shared/services/gender.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './inscription.component.html',
  styleUrl: './inscription.component.css'
})
export class InscriptionComponent {

  constructor(private router: Router) { }


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
    direction: new FormControl,


    
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
    }
    if (this.loginForm.valid) {
      this.service.register(this.loginForm.value).subscribe({
        next: (response) => {
          console.log('Inscription réussie', response);
          console.log(this.loginForm.value);
          this.router.navigate(['/cart']);
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
