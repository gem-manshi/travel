import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldComponent } from '../form-field/form-field.component'; // Import the form field component
 
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
 
  // This component manages its own expanded state
  isExpanded = true;
 
  ngOnInit(): void {
    // Optionally set the initial state from the config
    this.isExpanded = this.section.isExpandedByDefault ?? true;
  }
 
  get isCollapsible(): boolean {
    return this.section.isCollapsible === true;
  }
 
  toggle(): void {
    if (this.isCollapsible) {
      this.isExpanded = !this.isExpanded;
    }
  }
}