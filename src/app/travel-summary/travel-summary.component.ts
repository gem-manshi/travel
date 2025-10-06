import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewBreakupComponent } from '@app/shared/common-components/view-breakup/view-breakup.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as formConfig from '@app/shared/schema/form-summary.config.json';
import { BreadcrumbComponent } from '@app/shared/common-components/breadcrumb/breadcrumb.component';
import { PremiumBreakupComponent } from '@app/shared/premium-breakup/premium-breakup.component';

@Component({
  selector: 'app-travel-summary',
  imports: [
    NgSelectModule,
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
    PremiumBreakupComponent,
  ],
  templateUrl: './travel-summary.component.html',
  styleUrl: './travel-summary.component.scss',
})
export class TravelSummaryComponent {
  bsModalRef?: BsModalRef;
  public config: any;
  private offcanvasService = inject(NgbOffcanvas);
  isFinalized = false;
  form!: FormGroup;
  premiumBreakupSection: any;
  isProposal = false;
  showBreakup = false;
  totalPremium = 4856;
  buttonLabel = 'View Breakup';
  breakupData = [
    { label: 'Premium Excluding Terrorism', value: 4000 },
    { label: 'Terrorism Premium', value: 115.5 },
    { label: 'Gross Premium', value: 4115.5 },
    { label: 'IGST 18%', value: 740.79 },
  ];

  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: BsModalService,
  ) {}

  ngOnInit(): void {
    this.config = formConfig;
  }
  redirect() {
    this.router.navigate(['cpm-proposal']);
  }

  onActionClick(): void {
    if (!this.showBreakup) {
      this.showBreakup = true;
      this.buttonLabel = 'Complete Transaction';
    } else {
      window.location.href = 'http://localhost:8902';
    }
  }
}
