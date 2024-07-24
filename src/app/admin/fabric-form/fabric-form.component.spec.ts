import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FabricFormComponent } from './fabric-form.component';

describe('FabricFormComponent', () => {
  let component: FabricFormComponent;
  let fixture: ComponentFixture<FabricFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FabricFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FabricFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
