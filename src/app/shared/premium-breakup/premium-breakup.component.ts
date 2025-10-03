import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-premium-breakup',
  imports: [CommonModule],
  templateUrl: './premium-breakup.component.html',
  styleUrl: './premium-breakup.component.scss',
})
export class PremiumBreakupComponent {
  @Input() title: string = 'Premium Breakup';
  @Input() breakupData: { label: string; value: string | number }[] = [];
}
