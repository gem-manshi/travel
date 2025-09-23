import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import configData from '../../shared/schema/form.config.json';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-travel-summary',
  imports: [CommonModule, RouterModule],
  templateUrl: './travel-summary.component.html',
  styleUrl: './travel-summary.component.scss',
})
export class TravelSummaryComponent {
  formData: any;
  config: any = configData;

  constructor(private router: Router) {
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
    this.router.navigateByUrl('http://localhost:8902');
  }
}
