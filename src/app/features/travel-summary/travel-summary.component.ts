import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import configData from '../../shared/schema/form.config.json';
import { CommonModule } from '@angular/common';
import { ViewBreakupComponent } from '@app/shared/common-components/view-breakup/view-breakup.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
@Component({
  selector: 'app-travel-summary',
  imports: [CommonModule, RouterModule],
  templateUrl: './travel-summary.component.html',
  styleUrl: './travel-summary.component.scss',
})
export class TravelSummaryComponent {
  bsModalRef?: BsModalRef;
  formData: any;
  config: any = configData;

  constructor(
    private router: Router,
    private modalService: BsModalService,
  ) {
    const navigation = this.router.getCurrentNavigation();
    this.formData = navigation?.extras?.state?.['formData'];
  }

  editPolicy() {
    this.router.navigate(['/travelSummary'], {
      state: { formData: this.formData },
    });
  }

  sharePolicy() {
    alert('Share functionality coming soon!');
  }

  downloadPolicy() {
    alert('Download functionality coming soon!');
  }

  completeTransaction() {
    alert('Transaction completed!');
  }
  goToApp() {
    window.location.href = 'http://localhost:8902';
  }

  viewBreakup() {
    const insuredDetails = this.config.sections.find(
      (section: any) => section.type === 'insuredDetails',
    );

    const premiumSummary = insuredDetails?.modals?.premiumSummary;
    console.log('section', premiumSummary);
    if (!premiumSummary) {
      console.error('Premium Summary config not found!');
      return;
    }

    const initialState = { config: premiumSummary };

    this.bsModalRef = this.modalService.show(ViewBreakupComponent, {
      initialState,
      class: 'modal-md',
    });
  }
}
