import { Component, signal, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

interface AutoPhoto {
  url: string;
  description?: string;
}

interface Auto {
  id: number;
  marca: string;
  modelo: string;
  precio: number;
  year: number;
  fotos: AutoPhoto[];
  descripcion: string;
  currentPhotoIndex: number;
  fechaSubida: Date;
}

@Component({
  selector: 'app-auto-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stories-container" #storiesContainer>
      <div class="stories-wrapper">
        <div class="story-item" *ngFor="let auto of autos; let autoIndex = index" [attr.data-auto-index]="autoIndex">
          <div class="story-header">
            <div class="auto-title">
              <h2>{{ auto.marca }} {{ auto.modelo }}</h2>
              <span class="year">{{ auto.year }}</span>
            </div>
            <div class="price">{{ auto.precio | currency:'USD':'symbol':'1.0-0' }}</div>
          </div>

          <div class="photo-carousel">
            <div class="progress-indicators">
              <div 
                *ngFor="let foto of auto.fotos; let i = index"
                class="progress-bar"
                [class.active]="i === auto.currentPhotoIndex"
                [class.completed]="i < auto.currentPhotoIndex">
              </div>
            </div>

            <div class="photos-container">
              <div 
                class="photo-track" 
                [style.transform]="'translateX(' + (-auto.currentPhotoIndex * 100) + '%)'">
                <div class="photo-slide" *ngFor="let foto of auto.fotos">
                  <img [src]="foto.url" [alt]="auto.marca + ' ' + auto.modelo" />
                </div>
              </div>

              <button 
                class="photo-nav-btn prev-photo" 
                (click)="previousPhoto(autoIndex)"
                [style.display]="auto.currentPhotoIndex > 0 ? 'flex' : 'none'">
                ‹
              </button>
              
              <button 
                class="photo-nav-btn next-photo" 
                (click)="nextPhoto(autoIndex)"
                [style.display]="auto.currentPhotoIndex < auto.fotos.length - 1 ? 'flex' : 'none'">
                ›
              </button>
            </div>
          </div>

          <div class="auto-info">
            <div class="photo-counter">
              {{ auto.currentPhotoIndex + 1 }} de {{ auto.fotos.length }}
            </div>
            <p class="description">{{ auto.descripcion }}</p>
            <div class="timestamp">{{ getTimeAgo(auto.fechaSubida) }}</div>
          </div>

          <div class="scroll-indicator" *ngIf="autoIndex < autos.length - 1">
            <div class="scroll-arrow">↓</div>
            <span>Desliza para ver más autos</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./auto-gallery.component.css']
})
export class AutoGalleryComponent implements OnInit, OnDestroy {
  @ViewChild('storiesContainer', { static: true }) storiesContainer!: ElementRef;
  
  currentAutoIndex = signal(0);
  private timeUpdateInterval: any;

  autos: Auto[] = [
    {
      id: 1,
      marca: '',
      modelo: '',
      precio: 0,
      year: 2023,
      fotos: [
        { url: 'assets/images/autos/auto1/foto1.JPG' },
        { url: 'assets/images/autos/auto1/foto2.JPG' },
        { url: 'assets/images/autos/auto1/foto3.JPG' }
      ],
      descripcion: 'Auto Mazada, full equipo, 30millones',
      currentPhotoIndex: 0,
      fechaSubida: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      marca: ' ',
      modelo: '',
      precio: 0,
      year: 2023,
      fotos: [
        { url: 'assets/images/autos/auto2/foto1.JPG' },
        { url: 'assets/images/autos/auto2/foto2.JPG' },
        { url: 'assets/images/autos/auto2/foto3.JPG' }
      ],
      descripcion: 'Auto Chevrolet, full equipo, 40millones',
      currentPhotoIndex: 0,
      fechaSubida: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: 3,
      marca: ' ',
      modelo: '',
      precio: 0,
      year: 2023,
      fotos: [
        { url: 'assets/images/autos/auto3/foto1.JPG' },
        { url: 'assets/images/autos/auto3/foto2.JPG' },
        { url: 'assets/images/autos/auto3/foto3.JPG' }
      ],
      descripcion: 'Camioneta Jeep, full equipo, 50millones',
      currentPhotoIndex: 0,
      fechaSubida: new Date(Date.now() - 6 * 60 * 60 * 1000)
    }
  ];

  ngOnInit() {
    this.startTimeUpdates();
  }

  ngOnDestroy() {
    this.stopTimeUpdates();
  }

  getTimeAgo(fechaSubida: Date): string {
    const ahora = new Date();
    const diferencia = ahora.getTime() - fechaSubida.getTime();
    const minutos = Math.floor(diferencia / (1000 * 60));
    const horas = Math.floor(diferencia / (1000 * 60 * 60));
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const semanas = Math.floor(dias / 7);

    if (minutos < 1) {
      return 'ahora';
    } else if (minutos < 60) {
      return `hace ${minutos} min`;
    } else if (horas < 24) {
      return `hace ${horas === 1 ? 'una hora' : horas + ' horas'}`;
    } else if (dias < 7) {
      return `hace ${dias === 1 ? 'un día' : dias + ' días'}`;
    } else {
      return `hace ${semanas === 1 ? 'una semana' : semanas + ' semanas'}`;
    }
  }

  nextPhoto(autoIndex: number) {
    const auto = this.autos[autoIndex];
    if (auto.currentPhotoIndex < auto.fotos.length - 1) {
      auto.currentPhotoIndex++;
    }
  }

  previousPhoto(autoIndex: number) {
    const auto = this.autos[autoIndex];
    if (auto.currentPhotoIndex > 0) {
      auto.currentPhotoIndex--;
    }
  }

  private startTimeUpdates() {
    this.timeUpdateInterval = setInterval(() => {
      // Actualizar timestamps si fuera necesario
    }, 60000);
  }

  private stopTimeUpdates() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
    }
  }
}
