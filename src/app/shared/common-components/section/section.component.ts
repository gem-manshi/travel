import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component'; // Import the form field component
import { FormService } from '@app/shared/form.service';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormFieldComponent, // Add FormFieldComponent here
  ],
  templateUrl: './section.component.html',
})
export class SectionComponent implements OnInit {
  @Input() section: any;
  @Input() form!: FormGroup;
  @Input() personFields: any[] = [];
  @Input() nomineeFields: any[] = [];
  @Output() buttonClick = new EventEmitter<any>();
  @Output() addFile = new EventEmitter<void>();
  @Output() removeFile = new EventEmitter<any>();

  @Output() stepperChange = new EventEmitter<{ field: any; action: string }>();

  constructor(
    private formService: FormService,
    private fb: FormBuilder,
  ) {}
  isExpanded = true;

  get familiesArray(): FormArray {
    return this.form.get('families') as FormArray;
  }
  getFormGroupFromArray(subsectionName: string, index: number): FormGroup {
    return this.getFormArray(subsectionName).at(index) as FormGroup;
  }

  ngOnInit(): void {
    this.isExpanded = this.section.isExpandedByDefault ?? true;
    this.section.subsections.forEach((subsection: any) => {
      if (subsection.type === 'form-array') {
        const formArray = this.fb.array([]);
        this.form.addControl(subsection.name, formArray);

        if (subsection.name === 'families') {
          this.addGroup(subsection);
        }
      }
    });
  }

  get isCollapsible(): boolean {
    return this.section.isCollapsible === true;
  }

  toggle(): void {
    if (this.isCollapsible) {
      this.isExpanded = !this.isExpanded;
    }
  }
  getFormArray(name: string): FormArray {
    return this.formService.getFormArray(this.form, name);
  }
  onStepperChange(event: any) {
    if (event.field.name === 'familyCount') {
      const familiesArray = this.getFormArray('families');

      // find the families subsection from config
      const familiesConfig = this.section.subsections.find(
        (s: any) => s.name === 'families',
      );

      if (!familiesConfig) {
        console.error('Families config not found!');
        return;
      }

      if (event.action === 'increment') {
        this.addGroup(familiesConfig);
      } else if (event.action === 'decrement' && familiesArray.length > 1) {
        familiesArray.removeAt(familiesArray.length - 1);
      }
    }
  }

  addGroup(subsection: any) {
    const formArray = this.getFormArray(subsection.name);
    const group = this.fb.group({});

    if (subsection.formGroupTemplate && subsection.formGroupTemplate.length) {
      subsection.formGroupTemplate.forEach((field: any) => {
        group.addControl(field.name, this.fb.control(field.value || null));
      });
    }

    formArray.push(group);
  }
  onButtonClick(field: any) {
    if (field.name === 'addMoreInsured') {
      const familyCountCtrl = this.form.get('familyCount');
      if (familyCountCtrl) {
        const newCount = (familyCountCtrl.value || 0) + 1;
        familyCountCtrl.setValue(newCount);
      }

      const familiesConfig = this.section.subsections.find(
        (s: any) => s.name === 'families',
      );
      if (familiesConfig) {
        this.addGroup(familiesConfig);
      }
    }
    if (field.name === 'addSelf') {
      console.log('Add Self clicked', field);
      field.disabled = true;

      const familiesArray = this.getFormArray('families');
      const familyGroup = familiesArray.at(
        familiesArray.length - 1,
      ) as FormGroup;

      (this.personFields || []).forEach((p: any) => {
        if (!familyGroup.get(p.name)) {
          familyGroup.addControl(p.name, this.fb.control(p.value || null));
        }
      });

      (this.nomineeFields || []).forEach((n: any) => {
        if (!familyGroup.get(n.name)) {
          familyGroup.addControl(n.name, this.fb.control(n.value || null));
        }
      });
    }
  }

  // addGroup(subsection: any) {
  //   const formArray = this.form.get(subsection.name) as FormArray;

  //   const group = this.fb.group({});

  //   subsection.formGroupTemplate.forEach((field: any) => {
  //     group.addControl(field.name, this.fb.control(field.value || null));
  //   });

  //   formArray.push(group);
  // }

  getFormGroup(control: AbstractControl): FormGroup {
    return this.formService.getFormGroup(control);
  }
  removeGroup(subsection: any, index: number) {
    const formArray = this.getFormArray(subsection.name);
    if (!formArray || formArray.length <= 0) return;

    formArray.removeAt(index);

    if (subsection.name === 'families') {
      const familyCountCtrl = this.form.get('familyCount');
      if (familyCountCtrl) {
        familyCountCtrl.setValue(formArray.length);
      }
    }
  }
}
