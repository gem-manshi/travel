import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { FormFieldComponent } from '../form-field/form-field.component';

@Component({
  selector: 'app-coverage-offcanvas',
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
  templateUrl: './coverage-offcanvas.component.html',
  styleUrl: './coverage-offcanvas.component.scss',
})
export class CoverageOffcanvasComponent {
  @Input() title: string = 'Coverage Options';
  @Input() config: any;
  form!: FormGroup;
  offcanvasService = inject(NgbOffcanvas);
  constructor(private fb: FormBuilder) {}
  ngOnInit(): void {
    this.form = this.createFormGroup();
  }
  openOffcanvas(content: any) {
    this.offcanvasService.open(content);
  }
  createFormGroup(): FormGroup {
    const group = this.fb.group({});
    this.config.items.forEach((item: any) => {
      if (item.dependentFields) {
        const nestedGroup = this.fb.group({});
        item.dependentFields.forEach((field: any) => {
          nestedGroup.addControl(
            field.name,
            this.fb.control(field.value ?? null),
          );
        });

        const mainControl = this.fb.control(item.checked);
        mainControl.valueChanges.subscribe((isChecked) => {
          isChecked ? nestedGroup.enable() : nestedGroup.disable();
        });

        if (!item.checked) {
          nestedGroup.disable();
        }
        group.addControl(item.name, nestedGroup);
        group.addControl(`${item.name}_checked`, mainControl);
      } else {
        group.addControl(item.name, this.fb.control(item.checked));
      }
    });
    return group;
  }
  getFormGroup(control: AbstractControl | null): FormGroup {
    return control as FormGroup;
  }
}
