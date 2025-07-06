import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule para *ngIf y *ngFor
import { HttpClientModule, HttpClient } from '@angular/common/http';

interface Auto {
  id: string;
  title: string;
  year: string;
  price: string;
  description: string;
  images: string[];
}

@Component({
  selector: 'app-auto-gallery',
  standalone: true, // <- IMPORTANTE: ahora es standalone
  templateUrl: './auto-gallery.component.html',
  styleUrls: ['./auto-gallery.component.css'],
  imports: [CommonModule, HttpClientModule], // <- necesario para *ngIf, *ngFor, y HttpClient
})
export class AutoGalleryComponent implements OnInit {
  autos: Auto[] = [];
  currentAutoIndex = 0;
  currentPhotoIndex = 0;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get<Auto[]>('assets/autos.json').subscribe(data => {
      this.autos = data;
    });
  }

  nextPhoto() {
    if (this.currentPhotoIndex < this.autos[this.currentAutoIndex].images.length - 1) {
      this.currentPhotoIndex++;
    } else {
      this.nextAuto();
    }
  }

  prevPhoto() {
    if (this.currentPhotoIndex > 0) {
      this.currentPhotoIndex--;
    } else {
      this.prevAuto();
    }
  }

  nextAuto() {
    if (this.currentAutoIndex < this.autos.length - 1) {
      this.currentAutoIndex++;
      this.currentPhotoIndex = 0;
    }
  }

  prevAuto() {
    if (this.currentAutoIndex > 0) {
      this.currentAutoIndex--;
      this.currentPhotoIndex = 0;
    }
  }
}
