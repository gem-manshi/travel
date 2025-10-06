import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component';
import { FormService } from '@app/shared/form.service';

@Component({
  selector: 'app-section',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormFieldComponent],
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
  showPremiumBreakup = false;

  get familiesArray(): FormArray {
    return this.form.get('families') as FormArray;
  }

  getFormArray(name: string): FormArray<FormGroup> {
    let ctrl = this.form.get(name) as FormArray<FormGroup> | null;
    if (!ctrl) {
      ctrl = this.fb.array<FormGroup>([]);
      this.form.addControl(name, ctrl);
    }
    return ctrl;
  }
  getFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  getFormGroupFromArray(subsectionName: string, index: number): FormGroup {
    return this.getFormArray(subsectionName).at(index) as FormGroup;
  }

  getNestedFormGroupArray(
    parentName: string,
    index: number,
    childName: string,
  ): FormGroup[] {
    const parentGroup = this.getFormGroupFromArray(parentName, index);
    const control = parentGroup.get(childName);
    return control instanceof FormArray
      ? (control.controls as FormGroup[])
      : [];
  }

  getInnerFormGroupArray(
    parentGroup: AbstractControl,
    childName: string,
  ): FormGroup[] {
    const ctrl = (parentGroup as FormGroup).get(childName);
    return ctrl instanceof FormArray ? (ctrl.controls as FormGroup[]) : [];
  }

  getSubsectionConfig(subsection: any, name: string) {
    if (!subsection || !subsection.subsections) return null;
    return subsection.subsections.find((s: any) => s.name === name);
  }

  ngOnInit(): void {
    this.isExpanded = this.section.isExpandedByDefault ?? true;

    this.section.subsections.forEach((subsection: any) => {
      if (subsection.type === 'form-array') {
        if (!this.form.get(subsection.name)) {
          this.form.addControl(subsection.name, this.fb.array([]));
        }

        if (subsection.name === 'families') {
          const familyCount = this.form.get('familyCount')?.value ?? 0;
          if (familyCount > 0) {
            for (let i = 0; i < familyCount; i++) {
              this.addGroup(subsection);
            }
          }
        }

        if (subsection.name === 'individuals') {
          const individualCount = this.form.get('individualCount')?.value ?? 0;
          if (individualCount > 0) {
            for (let i = 0; i < individualCount; i++) {
              this.addGroup(subsection);
            }
          }
        }
      }
    });
  }

  addGroup(subsection: any) {
    const formArray = this.getFormArray(subsection.name);
    const group = this.fb.group({});

    if (subsection.formGroupTemplate?.length) {
      subsection.formGroupTemplate.forEach((field: any) => {
        group.addControl(field.name, this.fb.control(field.value ?? null));
      });
    }

    group.addControl('addSelfDisabled', this.fb.control(false));
    group.addControl('addSpouseDisabled', this.fb.control(false));
    group.addControl('addChildDisabled', this.fb.control(false));

    if (subsection.name === 'individuals') {
      const nomineeConfig = subsection.subsections?.find(
        (s: any) => s.name === 'nominees',
      );
      if (nomineeConfig) {
        const nomineesArray = this.fb.array<FormGroup>([]);
        const nomineeGroup = this.fb.group({});
        nomineeConfig.formGroupTemplate.forEach((field: any) => {
          nomineeGroup.addControl(
            field.name,
            this.fb.control(field.value ?? null),
          );
        });
        nomineesArray.push(nomineeGroup);
        group.addControl('nominees', nomineesArray);
      }
    }

    formArray.push(group);
  }
  handleFamilyButtonClick(event: any, familyIndex: number) {
    this.onButtonClick({ ...event, familyIndex });
  }

  onStepperChange(event: any) {
    if (event.field.name === 'familyCount') {
      const familiesArray = this.getFormArray('families');
      const familiesConfig = this.section.subsections.find(
        (s: any) => s.name === 'families',
      );
      if (!familiesConfig) return;
      if (event.action === 'increment') this.addGroup(familiesConfig);
      else if (event.action === 'decrement' && familiesArray.length > 1)
        familiesArray.removeAt(familiesArray.length - 1);
    }

    if (event.field.name === 'individualCount') {
      const individualsArray = this.getFormArray('individuals');
      const individualsConfig = this.section.subsections.find(
        (s: any) => s.name === 'individuals',
      );
      if (!individualsConfig) return;
      if (event.action === 'increment') this.addGroup(individualsConfig);
      else if (event.action === 'decrement' && individualsArray.length > 1)
        individualsArray.removeAt(individualsArray.length - 1);
    }
  }

  onButtonClick(field: any) {
    if (field.name === 'addMoreInsured') {
      const familyCountCtrl = this.form.get('familyCount');
      if (familyCountCtrl)
        familyCountCtrl.setValue((familyCountCtrl.value || 0) + 1);

      const familiesConfig = this.section.subsections.find(
        (s: any) => s.name === 'families',
      );
      if (familiesConfig) this.addGroup(familiesConfig);
      return;
    }

    const familiesArray = this.getFormArray('families');
    const targetIndex = field.familyIndex ?? 0;

    const familyGroup = familiesArray.at(targetIndex) as FormGroup;

    if (field.name === 'addSelf') {
      let selfInsuredArray = familyGroup.get('selfInsured') as FormArray;
      if (!selfInsuredArray) {
        selfInsuredArray = this.fb.array([]);
        familyGroup.addControl('selfInsured', selfInsuredArray);
      }

      const selfConfig = this.section.subsections
        .find((s: any) => s.name === 'families')
        ?.subsections.find((s: any) => s.name === 'selfInsured');
      if (selfConfig) {
        const selfGroup = this.createNestedGroup(selfConfig);
        selfInsuredArray.push(selfGroup);
      }

      familyGroup.get('addSelfDisabled')?.setValue(true);
    }

    if (field.name === 'addSpouse') {
      let spouseInsuredArray = familyGroup.get('spouseInsured') as FormArray;
      if (!spouseInsuredArray) {
        spouseInsuredArray = this.fb.array([]);
        familyGroup.addControl('spouseInsured', spouseInsuredArray);
      }

      const spouseConfig = this.section.subsections
        .find((s: any) => s.name === 'families')
        ?.subsections.find((s: any) => s.name === 'spouseInsured');
      if (spouseConfig) {
        const spouseGroup = this.createNestedGroup(spouseConfig);
        spouseInsuredArray.push(spouseGroup);
      }

      familyGroup.get('addSpouseDisabled')?.setValue(true);
    }

    if (field.name === 'addChild') {
      let childInsuredArray = familyGroup.get('childInsured') as FormArray;
      if (!childInsuredArray) {
        childInsuredArray = this.fb.array([]);
        familyGroup.addControl('childInsured', childInsuredArray);
      }

      const childConfig = this.section.subsections
        .find((s: any) => s.name === 'families')
        ?.subsections.find((s: any) => s.name === 'childInsured');
      if (childConfig) {
        const childGroup = this.createNestedGroup(childConfig);
        childInsuredArray.push(childGroup);
      }

      familyGroup.get('addChildDisabled')?.setValue(true);
    }

    if (field.name === 'addSpouseIndividual') {
      const individualsArray = this.getFormArray('individuals');
      const individualGroup = individualsArray.at(field.index) as FormGroup;
      this.addNestedIndividual(individualGroup, 'spouseInsured', 'individuals');
      individualGroup.get('addSpouseDisabled')?.setValue(true);
    }

    if (field.name === 'addChildIndividual') {
      const individualsArray = this.getFormArray('individuals');
      const individualGroup = individualsArray.at(field.index) as FormGroup;
      this.addNestedIndividual(individualGroup, 'childInsured', 'individuals');
    }
  }

  private createNestedGroup(config: any): FormGroup {
    const group = this.fb.group({});
    config.formGroupTemplate.forEach((f: any) =>
      group.addControl(f.name, this.fb.control(f.value ?? null)),
    );

    const nomineeConfig = config.subsections?.find(
      (s: any) => s.name === 'nominees',
    );
    if (nomineeConfig) {
      const nomineesArray: FormArray = this.fb.array([]);
      const nomineeGroup = this.fb.group({ sameAsPrimary: [false] });
      nomineeConfig.formGroupTemplate.forEach((f: any) => {
        nomineeGroup.addControl(f.name, this.fb.control(f.value ?? null));
      });
      nomineesArray.push(nomineeGroup);
      group.addControl('nominees', nomineesArray);
    }
    return group;
  }

  private addNestedIndividual(
    parentGroup: FormGroup,
    relationName: 'spouseInsured' | 'childInsured',
    parentType: string,
  ) {
    let arr = parentGroup.get(relationName) as FormArray<FormGroup>;
    if (!arr) {
      arr = this.fb.array<FormGroup>([]);
      parentGroup.addControl(relationName, arr);
    }

    const config = this.section.subsections
      .find((s: any) => s.name === parentType)
      ?.subsections?.find((s: any) => s.name === relationName);

    if (config) {
      const group = this.createNestedGroup(config);
      arr.push(group);
    }
  }

  removeNestedGroup(
    parentName: string,
    parentIndex: number,
    childName: string,
    childIndex: number,
  ) {
    const parentGroup = this.getFormGroupFromArray(parentName, parentIndex);
    const control = parentGroup.get(childName) as FormArray;
    if (control && control.length > 0) control.removeAt(childIndex);
    if (
      parentName === 'individuals' &&
      childName === 'spouseInsured' &&
      control.length === 0
    ) {
      parentGroup.get('addSpouseDisabled')?.setValue(false);
    }
    if (control && control.length === 0) {
      switch (childName) {
        case 'selfInsured':
          parentGroup.get('addSelfDisabled')?.setValue(false);
          break;
        case 'spouseInsured':
          parentGroup.get('addSpouseDisabled')?.setValue(false);
          break;
        case 'childInsured':
          parentGroup.get('addChildDisabled')?.setValue(false);
          break;
      }
    }
  }

  removeGroup(subsection: any, index: number) {
    const formArray = this.getFormArray(subsection.name);
    if (!formArray || formArray.length <= 0) return;
    formArray.removeAt(index);

    if (subsection.name === 'families') {
      const familyCountCtrl = this.form.get('familyCount');
      if (familyCountCtrl) familyCountCtrl.setValue(formArray.length);
    }
  }

  onSameAsPrimaryChange(
    nomineeGroup: FormGroup,
    familyIndex: number,
    relation: 'spouseInsured' | 'childInsured',
  ) {
    const familiesArray = this.getFormArray('families');
    const familyGroup = familiesArray.at(familyIndex) as FormGroup;

    const selfInsuredArray = familyGroup.get('selfInsured') as FormArray;
    if (!selfInsuredArray || selfInsuredArray.length === 0) return;
    const selfGroup = selfInsuredArray.at(0) as FormGroup;

    const sameAs = nomineeGroup.get('sameAsPrimary')?.value;
    if (sameAs) {
      nomineeGroup.patchValue({
        nomineeName:
          (selfGroup.get('firstName')?.value || '') +
          ' ' +
          (selfGroup.get('lastName')?.value || ''),
        nomineeDob: selfGroup.get('dob')?.value,
        nomineeGender: selfGroup.get('gender')?.value,
        nomineeAddress: selfGroup.get('address1')?.value,
        relationship: relation === 'spouseInsured' ? 'spouse' : 'child',
      });
    } else {
      nomineeGroup.patchValue({
        nomineeName: null,
        nomineeDob: null,
        nomineeGender: null,
        nomineeAddress: null,
        relationship: null,
      });
    }
  }

  onSameAsPrimaryChangeIndividual(
    nomineeGroup: FormGroup,
    individualIndex: number,
    relation: 'spouseInsured' | 'childInsured',
  ) {
    const individualsArray = this.getFormArray('individuals');
    const individualGroup = individualsArray.at(individualIndex) as FormGroup;

    const selfInsuredArray = individualGroup.get('selfInsured') as FormArray;
    if (!selfInsuredArray || selfInsuredArray.length === 0) return;
    const selfGroup = selfInsuredArray.at(0) as FormGroup;

    const sameAs = nomineeGroup.get('sameAsPrimary')?.value;
    if (sameAs) {
      nomineeGroup.patchValue({
        nomineeName:
          (selfGroup.get('firstName')?.value || '') +
          ' ' +
          (selfGroup.get('lastName')?.value || ''),
        nomineeDob: selfGroup.get('dob')?.value,
        nomineeGender: selfGroup.get('gender')?.value,
        nomineeAddress: selfGroup.get('address1')?.value,
        relationship: relation === 'spouseInsured' ? 'spouse' : 'child',
      });
    } else {
      nomineeGroup.patchValue({
        nomineeName: null,
        nomineeDob: null,
        nomineeGender: null,
        nomineeAddress: null,
        relationship: null,
      });
    }
  }

  get isCollapsible(): boolean {
    return this.section.isCollapsible === true;
  }

  toggle(): void {
    if (this.isCollapsible) this.isExpanded = !this.isExpanded;
  }

  onNextClick() {
    this.showPremiumBreakup = true;
  }
}
