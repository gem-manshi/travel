import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ViewBreakupComponent } from '@app/shared/common-components/view-breakup/view-breakup.component';
import { NgbOffcanvas } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import * as formConfig from '@app/shared/schema/form-summary.config.json';
import { BreadcrumbComponent } from '@app/shared/common-components/breadcrumb/breadcrumb.component';

@Component({
  selector: 'app-travel-summary',
  imports: [
    NgSelectModule,
    CommonModule,
    ReactiveFormsModule,
    BreadcrumbComponent,
  ],
  templateUrl: './travel-summary.component.html',
  styleUrl: './travel-summary.component.scss',
})
export class TravelSummaryComponent {
  bsModalRef?: BsModalRef;
  public config: any;
  private offcanvasService = inject(NgbOffcanvas);
  public isProposal = false;
  isFinalized = false;
  constructor(
    private http: HttpClient,
    private router: Router,
    private modalService: BsModalService,
    // private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    this.config = formConfig;
  }
  redirect() {
    this.router.navigate(['cpm-proposal']);
  }

  viewBreakup() {
    const initialState = {
      config: this.config.modals.premiumSummary,
    };
    this.bsModalRef = this.modalService.show(ViewBreakupComponent, {
      initialState,
      class: 'modal-md',
    });
  }
  // handleButtonClick(field: any): void {
  //   if (field.action === 'ckycOffCanvas') {
  //     this.openCKycOffcanvas();
  //   }
  // }

  handleFinalizeClick(): void {
    //   if (this.isFinalized) {
    //     window.location.href = 'http://localhost:8902';
    //   } else {
    //     this.toastr.success('The proposal has been submitted successfully');
    //     this.isFinalized = true;
    //   }
    // }
  }
}
