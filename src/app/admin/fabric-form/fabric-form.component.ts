import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FabricService } from '../../shared/services/fabric.service';
import { Fabric } from '../../shared/entities/entities';

@Component({
  selector: 'app-fabric-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './fabric-form.component.html',
  styleUrl: './fabric-form.component.css'
})
export class FabricFormComponent {
  fabricForm!: FormGroup;
  fabricId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private fabricService: FabricService
  ) {}

  ngOnInit(): void {
    this.fabricId = this.route.snapshot.params['id'] ? +this.route.snapshot.params['id'] : null;
    this.initializeForm();

    if (this.fabricId) {
      this.loadFabric();
    }
  }

  initializeForm(): void {
    this.fabricForm = this.fb.group({
      fabricName: ['', Validators.required],
      coeff: [0, Validators.required]
    });
  }

  loadFabric(): void {
    this.fabricService.getById(this.fabricId!).subscribe((data) => {
      this.fabricForm.patchValue({
        fabricName: data.fabricName,
        coeff: data.coeff
      });
    });
  }

  onSubmit(): void {
    const formValues = this.fabricForm.value;
    const fabric: Fabric = {
      id: this.fabricId!,
      fabricName: formValues.fabricName,
      coeff: formValues.coeff
    };

    if (this.fabricId) {
      this.fabricService.update(fabric).subscribe({
        next: () => this.router.navigate(['/admin/articles']),
        error: (err) => console.error('Erreur lors de la modification de la matière:', err)
      });
    } else {
      this.fabricService.create(fabric).subscribe({
        next: () => this.router.navigate(['/admin/articles']),
        error: (err) => console.error('Erreur lors de la création de la matière:', err)
      });
    }
  }

}
