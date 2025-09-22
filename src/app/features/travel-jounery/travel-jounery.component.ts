import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  CommonModule,
  NgSwitch,
  NgSwitchCase,
  NgIf,
  NgFor,
} from '@angular/common';
import { FormsModule } from '@angular/forms';
import formConfigData from '../../shared/schema/form.config.json';
import { Router, RouterModule } from '@angular/router';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-travel-jounery',
  imports: [
    CommonModule,
    FormsModule,
    NgIf,
    NgFor,
    NgSwitch,
    NgSwitchCase,
    RouterModule,
    NgSelectModule,
    BsDatepickerModule,
  ],
  templateUrl: './travel-jounery.component.html',
  styleUrl: './travel-jounery.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class TravelJouneryComponent implements OnInit {
  config: any = formConfigData;
  formConfig: any = formConfigData;

  connectingFlights: any[] = [];

  departureFlights: any[] = [{}];
  returnFlights: any[] = [];
  returnJourneyEnabled = false;
  departureFields: any[] = [];
  returnFields: any[] = [];
  insuredSection: any;
  persons: any[] = [];

  showChildDetails: boolean = false;
  disableAddSelfFamily = false;
  disableAddSelfIndividual = false;

  personsFamily: any[][] = [];
  personsIndividual: any[] = [];

  addSelfClicked: boolean[] = [];
  addSpouseClicked: boolean[] = [];
  addChildClicked: boolean[] = [];
  familyChecked: boolean = false;
  individualChecked = false;

  families: any[] = [];

  selectedDate: Date | null = null;
  getPremiumClicked: boolean = false;

  constructor(private router: Router) {}

  /**
   * ngOnInit is the first life cycle method of Angular
   * @member ngOnInit
   * @memberof PolicyJourneyComponent
   */
  ngOnInit() {
    this.connectingFlights = [];
    this.familyChecked = false;
    this.insuredSection = this.config.sections.find(
      (s: any) => s.type === 'insuredDetails',
    );
    const departureSection = this.config.sections.find(
      (s: any) => s.type === 'departureDetails',
    );

    if (departureSection) {
      const depGroup = departureSection.fields.find(
        (f: any) => f.name === 'departureFlights',
      );
      const retGroup = departureSection.fields.find(
        (f: any) => f.name === 'returnFlights',
      );

      if (depGroup && depGroup.fields) {
        this.departureFields = depGroup.fields;
      }

      if (retGroup && retGroup.fields) {
        this.returnFields = retGroup.fields;
      }
    }
    const familyField = this.insuredSection.fields.find(
      (f: any) => f.type === 'checkbox',
    );
    const stepper = this.insuredSection.fields.find(
      (f: any) => f.type === 'stepper',
    );

    if (familyField?.value?.includes('family')) {
      this.familyChecked = true;

      const count = stepper?.value || 1;
      this.families = Array(count)
        .fill({})
        .map(() => ({}));
      this.personsFamily = Array(count)
        .fill([])
        .map(() => []);
    }
  }

  /**
   * Method to use to add connecting flight details.
   * @method addFlight
   * @memberof PolicyJourneyComponent
   */
  addFlight(type: 'departure' | 'return') {
    if (type === 'departure') {
      this.departureFlights.push({});
    } else {
      this.returnFlights.push({});
    }
  }

  /**
   * Method to use to remove connecting flight details.
   * @method removeFlight
   * @memberof PolicyJourneyComponent
   */
  removeFlight(index: number, type: 'departure' | 'return') {
    if (type === 'departure') {
      this.departureFlights.splice(index, 1);
    } else {
      this.returnFlights.splice(index, 1);
    }
  }

  /**
   * Method to use to checkbox for return journey flight details.
   * @method toggleReturnJourney
   * @memberof PolicyJourneyComponent
   */
  toggleReturnJourney(event: Event) {
    const input = event.target as HTMLInputElement;
    const enabled = input.checked;
    this.returnJourneyEnabled = enabled;

    if (enabled && this.returnFlights.length === 0) {
      this.returnFlights.push({});
    }
    if (!enabled) {
      this.returnFlights = [];
    }
  }

  /**
   * Method to use to get family details count.
   * @method getFamilyCount
   * @memberof PolicyJourneyComponent
   */
  getFamilyCount(section: any): number {
    const stepper = section.fields.find((f: any) => f.name === 'familyCount');
    return stepper?.value || 0;
  }

  /**
   * Method to use to get family array.
   * @method getFamilyArray
   * @memberof PolicyJourneyComponent
   */
  getFamilyArray(section: any): number[] {
    return Array(this.getFamilyCount(section)).fill(0);
  }

  /**
   * Method to use to add persons in insured details.
   * @method addPerson
   * @memberof PolicyJourneyComponent
   */
  addPerson(type: string, index: number, isFamily: boolean = true) {
    if (isFamily) {
      if (!this.personsFamily[index]) {
        this.personsFamily[index] = [];
      }

      let targetArray = this.personsFamily[index];
      let label = '';

      if (type === 'addSelf') {
        label = 'Self';
        this.addSelfClicked[index] = true;
        targetArray.splice(0, 0, { label, data: {} });
        return;
      }

      if (type === 'addSpouse') {
        label = 'Spouse';
        this.addSpouseClicked[index] = true;
        const selfIndex = targetArray.findIndex((p) => p.label === 'Self');
        const insertIndex = selfIndex >= 0 ? selfIndex + 1 : targetArray.length;
        targetArray.splice(insertIndex, 0, { label, data: {} });
        return;
      }

      if (type === 'addChild') {
        label = 'Child';
        this.addChildClicked[index] = true;
        targetArray.push({ label, data: {} });
        return;
      }
    } else {
      const target = this.personsIndividual[index];

      if (!target.members) {
        target.members = [];
      }

      if (type === 'addSpouse') {
        target.members.push({ label: 'Spouse', data: {} });
      }

      if (type === 'addChild') {
        target.members.push({ label: 'Child', data: {} });
      }
    }
  }

  hasSpouse(person: any): boolean {
    return person.members?.some((m: any) => m.label === 'Spouse') || false;
  }

  addChildToIndividual(individualIndex: number) {
    const target = this.personsIndividual[individualIndex];
    if (!target.members) {
      target.members = [];
    }

    target.members.push({
      label: 'Child',
      data: {},
    });
  }

  hasChild(person: any): boolean {
    return person.members?.some((m: any) => m.label === 'Child') || false;
  }

  /**
   * Method to use to add self when individual is checked.
   * @method onCheckboxChange
   * @memberof PolicyJourneyComponent
   */

  onCheckboxChange(event: Event, field: any, key: string) {
    const input = event.target as HTMLInputElement;

    if (!Array.isArray(field.value)) {
      field.value = [];
    }

    if (key === 'family') {
      if (input.checked) {
        if (!field.value.includes(key)) field.value.push(key);
        this.familyChecked = true;

        const familyStepper = this.insuredSection.fields.find(
          (f: any) => f.name === 'familyCount',
        );
        if (
          familyStepper &&
          (!familyStepper.value || familyStepper.value === 0)
        ) {
          familyStepper.value = 1;
        }

        const count = familyStepper?.value || 1;
        this.families = Array(count)
          .fill({})
          .map(() => ({}));
        this.personsFamily = Array(count)
          .fill(0)
          .map(() => []);
      } else {
        field.value = field.value.filter((v: any) => v !== key);
        this.familyChecked = false;
        this.families = [];
        this.personsFamily = [];
        const familyStepper = this.insuredSection.fields.find(
          (f: any) => f.name === 'familyCount',
        );
        if (familyStepper) familyStepper.value = 0;
      }
    }

    if (key === 'individual') {
      const individualStepper = this.insuredSection.fields.find(
        (f: any) => f.name === 'individualCount',
      );

      if (input.checked) {
        if (!field.value.includes(key)) field.value.push(key);
        this.individualChecked = true;

        if (
          individualStepper &&
          (!individualStepper.value || individualStepper.value === 0)
        ) {
          individualStepper.value = 1;
        }

        const count = individualStepper?.value || 1;
        this.personsIndividual = Array(count)
          .fill(0)
          .map(() => ({
            label: 'Self',
            data: {},
            members: [],
          }));
      } else {
        field.value = field.value.filter((v: any) => v !== key);
        this.individualChecked = false;
        this.personsIndividual = [];
        if (individualStepper) individualStepper.value = 0;
      }
    }
  }

  incrementIndividual(section: any) {
    const stepper = section.fields.find(
      (f: any) => f.name === 'individualCount',
    );
    if (!stepper) return;

    stepper.value++;
    if (!this.individualChecked) this.individualChecked = true;

    while (this.personsIndividual.length < stepper.value) {
      this.personsIndividual.push({
        label: 'Self',
        data: {},
        members: [],
      });
    }
  }

  decrementIndividual(section: any) {
    const stepper = section.fields.find(
      (f: any) => f.name === 'individualCount',
    );
    if (!stepper || stepper.value <= 0) return;

    stepper.value--;
    this.personsIndividual.splice(stepper.value);

    if (stepper.value === 0) {
      this.individualChecked = false;
      const cbField = this.insuredSection.fields.find(
        (f: any) => f.type === 'checkbox',
      );
      if (cbField)
        cbField.value = cbField.value.filter((v: any) => v !== 'individual');
    }
  }

  removeIndividual(index: number, section: any) {
    this.personsIndividual.splice(index, 1);

    const stepper = section.fields.find(
      (f: any) => f.name === 'individualCount',
    );
    if (stepper) stepper.value = this.personsIndividual.length;

    if (this.personsIndividual.length === 0) {
      this.individualChecked = false;
      const cbField = this.insuredSection.fields.find(
        (f: any) => f.type === 'checkbox',
      );
      if (cbField)
        cbField.value = cbField.value.filter((v: any) => v !== 'individual');
      if (stepper) stepper.value = 0;
    }
  }

  incrementFamily(section: any) {
    const stepper = section.fields.find((f: any) => f.name === 'familyCount');
    if (!stepper) return;

    stepper.value++;
    if (!this.familyChecked) this.familyChecked = true;

    while (this.families.length < stepper.value) {
      this.families.push({});
      this.personsFamily.push([]);
    }
  }

  decrementFamily(section: any) {
    const stepper = section.fields.find((f: any) => f.name === 'familyCount');
    if (!stepper || stepper.value <= 0) return;

    stepper.value--;
    this.families.splice(stepper.value);
    this.personsFamily.splice(stepper.value);

    if (stepper.value === 0) {
      this.familyChecked = false;
      const cbField = this.insuredSection.fields.find(
        (f: any) => f.type === 'checkbox',
      );
      if (cbField)
        cbField.value = cbField.value.filter((v: any) => v !== 'family');
    }
  }

  removeFamily(index: number, section: any) {
    this.families.splice(index, 1);
    this.personsFamily.splice(index, 1);

    const stepper = section.fields.find((f: any) => f.name === 'familyCount');
    if (stepper) stepper.value = this.families.length;

    if (this.families.length === 0) {
      this.familyChecked = false;
      const cbField = this.insuredSection.fields.find(
        (f: any) => f.type === 'checkbox',
      );
      if (cbField)
        cbField.value = cbField.value.filter((v: any) => v !== 'family');
      if (stepper) stepper.value = 0;
    }
  }

  /**
   * Method to use to add child to family.
   * @method addChildToFamily
   * @memberof PolicyJourneyComponent
   */
  addChildToFamily(familyIndex: number) {
    if (!this.personsFamily[familyIndex]) {
      this.personsFamily[familyIndex] = [];
    }

    this.personsFamily[familyIndex].push({
      label: 'Child',
      data: {},
    });
  }

  /**
   * Method to use to add more insured family details.
   * @method addMoreInsured
   * @memberof PolicyJourneyComponent
   */
  addMoreInsured(section: any) {
    const stepper = section.fields.find((f: any) => f.type === 'stepper');
    if (stepper && stepper.value < stepper.max) {
      stepper.value++;
      this.families.push([]);
      this.personsFamily.push([]);
    }
  }

  /**
   * Method to use to remove person.
   * @method removePerson
   * @memberof PolicyJourneyComponent
   */
  removePerson(familyIndex: number, personIndex: number) {
    const removed = this.personsFamily[familyIndex][personIndex];
    this.personsFamily[familyIndex].splice(personIndex, 1);

    if (removed.label === 'Self') this.addSelfClicked[familyIndex] = false;
    if (removed.label === 'Spouse') this.addSpouseClicked[familyIndex] = false;
    if (removed.label === 'Child') this.addChildClicked[familyIndex] = false;
  }

  toggleFamily(event: any) {
    this.familyChecked = event.target.checked;

    if (this.familyChecked) {
      this.families = [{}];
    } else {
      this.families = [];
    }
  }

  onGetPremiumClick() {
    this.getPremiumClicked = true;
  }
  /**
   * Method to use to navigate to policy summay screen.
   * @method goToPolicySummary
   * @memberof PolicyJourneyComponent
   */
  goToPolicySummary() {
    this.router.navigate(['/travel-summary'], {
      // state: { formData: this.formGroup.value }
    });
  }
}
