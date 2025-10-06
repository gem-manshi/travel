import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { CoverageOffcanvasComponent } from '@app/shared/common-components/coverage-offcanvas/coverage-offcanvas.component';
import { CommonModule } from '@angular/common';
import { BreadcrumbComponent } from '@app/shared/common-components/breadcrumb/breadcrumb.component';
import { SectionComponent } from '@app/shared/common-components/section/section.component';
import * as formConfig from '@app/shared/schema/form.config.json';
@Component({
  selector: 'app-travel-journey',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    BreadcrumbComponent,
    SectionComponent,
  ],
  templateUrl: './travel-journey.component.html',
  styleUrl: './travel-journey.component.scss',
})
export class TravelJourneyComponent {
  bsModalRef?: BsModalRef;
  config: any;
  form!: FormGroup;
  sectionState = new Map<string, boolean>();
  private offcanvasService = inject(NgbOffcanvas);
  showPremiumBreakup = false;
  premiumBreakupSection: any;
  buttonLabel = 'Get Premium';
  totalPremium = 4856;
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private modalService: BsModalService,
    private router: Router,
  ) {}
  ngOnInit(): void {
    this.config = formConfig;
    this.form = this.createFormGroup();

    this.config?.sections?.forEach((section: any) => {
      this.sectionState.set(section.title, true);
    });
  }

  private buildValidators(validators: any): ValidatorFn[] {
    const validatorFns: ValidatorFn[] = [];
    for (const key in validators) {
      const value = validators[key];
      switch (key) {
        case 'required':
          if (value) validatorFns.push(Validators.required);
          break;
        case 'requiredTrue':
          if (value) validatorFns.push(Validators.requiredTrue);
          break;
        case 'minLength':
          validatorFns.push(Validators.minLength(value));
          break;
        case 'maxLength':
          validatorFns.push(Validators.maxLength(value));
          break;
        case 'min':
          validatorFns.push(Validators.min(value));
          break;
        case 'max':
          validatorFns.push(Validators.max(value));
          break;
        case 'email':
          if (value) validatorFns.push(Validators.email);
          break;
        case 'pattern':
          validatorFns.push(Validators.pattern(value));
          break;
      }
    }
    return validatorFns;
  }

  createFormGroup(): FormGroup {
    const group = this.fb.group({});

    this.config.sections.forEach((section: any) => {
      section.subsections?.forEach((subsection: any) => {
        if (subsection.type === 'form-array') {
          group.addControl(subsection.name, this.fb.array([]));
        } else {
          subsection.fields?.forEach((field: any) => {
            const validators = this.buildValidators(field.validators || {});
            group.addControl(
              field.name,
              this.fb.control(field.value ?? null, validators),
            );
          });
        }
      });
    });

    return group;
  }

  openCoverageOffcanvas(): void {
    const offCanvasConfig = this.config.offCanvasConfigs.addCovers;
    const offcanvasRef = this.offcanvasService.open(
      CoverageOffcanvasComponent,
      { position: 'end', panelClass: 'offcanvas-width-40' },
    );
    offcanvasRef.componentInstance.config = offCanvasConfig;
  }
  handleButtonClick(field: any): void {
    if (field.action === 'addCovers') {
      this.openCoverageOffcanvas();
    }
  }

  redirect() {
    this.router.navigate(['cpm-review'], {
      state: { isProposal: false },
    });
  }
  onNextClick(): void {
    if (this.buttonLabel === 'Get Premium') {
      this.showPremiumBreakup = true;

      const breakupValues = {
        premiumExcludingTerrorism: 1200,
        terrorismPremium: 50,
        grossPremium: 1250,
        igst: 225,
        totalPremium: 1475,
      };

      this.premiumBreakupSection = this.config?.sections?.find(
        (s: any) => s.type === 'premiumDetails',
      );

      if (this.premiumBreakupSection?.subsections?.length) {
        this.premiumBreakupSection.subsections[0].fields.forEach(
          (field: any) => {
            const key = field.name as keyof typeof breakupValues;
            field.value = breakupValues[key] ?? '';
          },
        );
      }

      if (this.form) {
        this.form.patchValue(breakupValues, { emitEvent: false });
      }

      this.buttonLabel = 'Next';
    } else {
      this.router.navigate(['/travel-summary']);
    }
  }
}
