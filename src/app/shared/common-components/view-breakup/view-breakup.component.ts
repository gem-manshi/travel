import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import configData from '../../schema/form.config.json';

@Component({
  selector: 'app-view-breakup',
  imports: [CommonModule],
  templateUrl: './view-breakup.component.html',
  styleUrl: './view-breakup.component.scss',
})
export class ViewBreakupComponent {
  config: any = configData;

  constructor(public bsModalRef: BsModalRef) {}
}
