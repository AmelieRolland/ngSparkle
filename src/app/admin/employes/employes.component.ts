import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { GenderService } from '../../shared/services/gender.service';
import { UserService } from '../../shared/services/user.service';
import { Router } from '@angular/router';
import { Gender } from '../../shared/entities/entities';

@Component({
  selector: 'app-employes',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './employes.component.html',
  styleUrls: ['./employes.component.css']
})
export class EmployesComponent {
  genders: Gender[] = [];
  employeeForm: FormGroup;

  constructor(
    private router: Router,
    private userService: UserService,
    private genderService: GenderService
  ) {
    this.employeeForm = new FormGroup({
      gender: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      surname: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(20)]),
      confirmPassword: new FormControl('', Validators.required),
      phone: new FormControl(''),
      birthday: new FormControl(''),
      direction: new FormControl(''),
      registration_date: new FormControl(new Date())
    });
  }

  ngOnInit() {
    this.genderService.getGenders().subscribe({
      next: (genders) => this.genders = genders,
      error: (error) => console.error('Erreur lors de la récupération des données', error)
    });
  }

  onSubmit() {
    if (this.employeeForm.valid) {
      const genderId = this.employeeForm.get('gender')?.value;
      const genderIRI = `/api/genders/${genderId}`;

      const userData = {
        ...this.employeeForm.value,
        gender: genderIRI, 
        roles: ['ROLE_EMPLOYEE'] 
      };

      delete userData.confirmPassword;

      this.userService.register(userData).subscribe({
        next: (response) => {
          console.log('Inscription réussie', response);
          this.router.navigate(['/admin/employees']);
        },
        error: (error) => {
          console.error('Erreur inscription employé', error);
        }
      });
    } else {
      console.log('Formulaire invalide');
    }
  }
}
