import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-feature-card-component',
  imports: [],
  templateUrl: './feature-card-component.html',
  styleUrl: './feature-card-component.css',
})
export class FeatureCardComponent {
   @Input() icon!: string;
  @Input() title!: string;
  @Input() description!: string;

}
