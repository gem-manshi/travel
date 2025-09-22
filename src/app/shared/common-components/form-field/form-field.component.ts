import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-field',
  imports: [],
  templateUrl: './form-field.component.html',
  styleUrl: './form-field.component.scss',
})
export class FormFieldComponent {
  @Input() field: any;
  @Input() form!: FormGroup;

  constructor() {}
  get isInvalid(): boolean {
    const control = this.form.get(this.field.name);
    return control ? control.invalid && control.touched : false;
  }

  getErrorKeys(errors: object | null | undefined): string[] {
    return errors ? Object.keys(errors) : [];
  }
}
