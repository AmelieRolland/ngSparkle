import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ServicesService } from '../../shared/services/services.service';import { Service } from '../../shared/entities/entities';

@Component({
  selector: 'app-service-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './service-form.component.html',
  styleUrl: './service-form.component.css'
})
export class ServiceFormComponent {
  serviceForm!: FormGroup;
  serviceId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private servicesService: ServicesService
  ) {}

  ngOnInit(): void {
    this.serviceId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.initializeForm();

    if (this.serviceId) {
      this.loadService();
    }
  }

  initializeForm(): void {
    this.serviceForm = this.fb.group({
      serviceName: ['', Validators.required],
      price: [0, Validators.required]
    });
  }

  loadService(): void {
    if (this.serviceId) {
      this.servicesService.getServiceById(this.serviceId).subscribe((data) => {
        this.serviceForm.patchValue({
          serviceName: data.serviceName,
          price: data.price
        });
      });
    }
  }

  onSubmit(): void {
    const formValues = this.serviceForm.value;
    const service: Service = {
      id: this.serviceId!,
      serviceName: formValues.serviceName,
      price: formValues.price
    };

    if (this.serviceId) {
      this.servicesService.updateService(service).subscribe({
        next: () => this.router.navigate(['/admin/articles']),
        error: (err) => console.error('Erreur lors de la modification du service:', err)
      });
    } else {
      this.servicesService.createService(service).subscribe({
        next: () => this.router.navigate(['/admin/articles']),
        error: (err) => console.error('Erreur lors de la création du service:', err)
      });
    }
  }

}
