import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';

@Component({
  selector: 'app-form-field',
  imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent {
  @Input() field: any;
  @Input() form!: FormGroup;
  @Output() buttonClick = new EventEmitter<any>();
  @Output() stepperChange = new EventEmitter<{
    field: any;
    action: 'increment' | 'decrement';
  }>();
  constructor(private fb: FormBuilder) {}
  get isInvalid(): boolean {
    const control = this.form.get(this.field.name);
    return control ? control.invalid && control.touched : false;
  }
  getErrorKeys(errors: object | null | undefined): string[] {
    return errors ? Object.keys(errors) : [];
  }
  onButtonClick(): void {
    this.buttonClick.emit(this.field);
  }
  onCheckboxChange(event: any, field: any): void {
    const control = this.form.get(field.name);
    if (!control) return;

    if (Array.isArray(control.value)) {
      const currentValue = control.value || [];
      const value = event.target.value;

      if (event.target.checked) {
        if (!currentValue.includes(value)) {
          control.setValue([...currentValue, value]);
        }
      } else {
        control.setValue(currentValue.filter((v: any) => v !== value));
      }
    }
  }

  incrementStepper(field: any) {
    const current = this.form.get(field.name)?.value || 0;
    this.form.get(field.name)?.setValue(current + 1);
    this.stepperChange.emit({ field, action: 'increment' });
  }

  decrementStepper(field: any) {
    const current = this.form.get(field.name)?.value || 0;
    if (current > 1) {
      this.form.get(field.name)?.setValue(current - 1);
      this.stepperChange.emit({ field, action: 'decrement' });
    }
  }
}
