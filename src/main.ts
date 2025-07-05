import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { AutoGalleryComponent } from './app/auto-gallery/auto-gallery.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AutoGalleryComponent],
  template: `
    <app-auto-gallery></app-auto-gallery>
  `,
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);