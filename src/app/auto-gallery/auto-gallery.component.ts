import { Component, signal, computed, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
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
  fechaSubida: Date; // Nueva propiedad para el timestamp
}

@Component({
  selector: 'app-auto-gallery',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stories-container" #storiesContainer>
      <div class="stories-wrapper">
        <div class="story-item" *ngFor="let auto of autos; let autoIndex = index" [attr.data-auto-index]="autoIndex">
          <!-- Header del auto -->
          <div class="story-header">
            <div class="auto-title">
              <h2>{{ auto.marca }} {{ auto.modelo }}</h2>
              <span class="year">{{ auto.year }}</span>
            </div>
            <div class="price">{{ auto.precio | currency:'USD':'symbol':'1.0-0' }}</div>
          </div>

          <!-- Carrusel de fotos del auto -->
          <div class="photo-carousel">
            <!-- Indicadores de progreso -->
            <div class="progress-indicators">
              <div 
                *ngFor="let foto of auto.fotos; let i = index"
                class="progress-bar"
                [class.active]="i === auto.currentPhotoIndex"
                [class.completed]="i < auto.currentPhotoIndex">
              </div>
            </div>

            <!-- Contenedor de fotos -->
            <div class="photos-container">
              <div 
                class="photo-track" 
                [style.transform]="'translateX(' + (-auto.currentPhotoIndex * 100) + '%)'">
                <div class="photo-slide" *ngFor="let foto of auto.fotos">
                  <img [src]="foto.url" [alt]="auto.marca + ' ' + auto.modelo" />
                </div>
              </div>

              <!-- Controles de navegación de fotos -->
              <button 
                class="photo-nav-btn prev-photo" 
                (click)="previousPhoto(autoIndex)"
                [style.display]="auto.currentPhotoIndex > 0 ? 'flex' : 'none'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              
              <button 
                class="photo-nav-btn next-photo" 
                (click)="nextPhoto(autoIndex)"
                [style.display]="auto.currentPhotoIndex < auto.fotos.length - 1 ? 'flex' : 'none'">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Información del auto - Debajo de la foto como Instagram -->
          <div class="auto-info">
            <div class="photo-counter">
              {{ auto.currentPhotoIndex + 1 }} de {{ auto.fotos.length }}
            </div>
            <p class="description">{{ auto.descripcion }}</p>
            <div class="timestamp">{{ getTimeAgo(auto.fechaSubida) }}</div>
          </div>

          <!-- Indicador de scroll -->
          <div class="scroll-indicator" *ngIf="autoIndex < autos.length - 1">
            <div class="scroll-arrow">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M7 13l3 3 7-7"/>
                <path d="M7 6l3 3 7-7"/>
              </svg>
            </div>
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
      marca: 'BMW',
      modelo: 'M3',
      precio: 75000,
      year: 2023,
      fotos: [
        { url: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      descripcion: 'Deportivo de alta gama con motor V6 turbo. Perfecto balance entre potencia y elegancia.',
      currentPhotoIndex: 0,
      fechaSubida: new Date(Date.now() - 2 * 60 * 60 * 1000) // Hace 2 horas
    },
    {
      id: 2,
      marca: 'Mercedes-Benz',
      modelo: 'AMG GT',
      precio: 120000,
      year: 2023,
      fotos: [
        { url: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      descripcion: 'Supercar alemán con diseño elegante y tecnología de vanguardia.',
      currentPhotoIndex: 0,
      fechaSubida: new Date(Date.now() - 4 * 60 * 60 * 1000) // Hace 4 horas
    },
    {
      id: 3,
      marca: 'Audi',
      modelo: 'RS7',
      precio: 95000,
      year: 2023,
      fotos: [
        { url: 'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/1719467/pexels-photo-1719467.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      descripcion: 'Liftback deportivo con tecnología avanzada y diseño futurista.',
      currentPhotoIndex: 0,
      fechaSubida: new Date(Date.now() - 6 * 60 * 60 * 1000) // Hace 6 horas
    },
    {
      id: 4,
      marca: 'Porsche',
      modelo: '911 Turbo',
      precio: 180000,
      year: 2023,
      fotos: [
        { url: 'https://images.pexels.com/photos/1638459/pexels-photo-1638459.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/2365572/pexels-photo-2365572.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      descripcion: 'Ícono deportivo alemán con motor turbo y herencia en carreras.',
      currentPhotoIndex: 0,
      fechaSubida: new Date(Date.now() - 12 * 60 * 60 * 1000) // Hace 12 horas
    },
    {
      id: 5,
      marca: 'Lamborghini',
      modelo: 'Huracán',
      precio: 250000,
      year: 2023,
      fotos: [
        { url: 'https://images.pexels.com/photos/1719467/pexels-photo-1719467.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/3729464/pexels-photo-3729464.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/1149137/pexels-photo-1149137.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      descripcion: 'Supercar italiano con diseño agresivo y rendimiento excepcional.',
      currentPhotoIndex: 0,
      fechaSubida: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // Hace 1 día
    },
    {
      id: 6,
      marca: 'Ferrari',
      modelo: 'F8 Tributo',
      precio: 280000,
      year: 2023,
      fotos: [
        { url: 'https://images.pexels.com/photos/1805053/pexels-photo-1805053.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/1592384/pexels-photo-1592384.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/3802510/pexels-photo-3802510.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      descripcion: 'Berlinetta V8 con herencia de carreras y tecnología de Fórmula 1.',
      currentPhotoIndex: 0,
      fechaSubida: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // Hace 2 días
    },
    {
      id: 7,
      marca: 'McLaren',
      modelo: '720S',
      precio: 320000,
      year: 2024,
      fotos: [
        { url: 'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      descripcion: 'Supercar británico con aerodinámica activa y tecnología de Fórmula 1. Potencia pura.',
      currentPhotoIndex: 0,
      fechaSubida: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // Hace 3 días
    },
    {
      id: 8,
      marca: 'Bugatti',
      modelo: 'Chiron',
      precio: 3200000,
      year: 2024,
      fotos: [
        { url: 'https://images.pexels.com/photos/1335077/pexels-photo-1335077.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/170811/pexels-photo-170811.jpeg?auto=compress&cs=tinysrgb&w=800' },
        { url: 'https://images.pexels.com/photos/1007410/pexels-photo-1007410.jpeg?auto=compress&cs=tinysrgb&w=800' }
      ],
      descripcion: 'Hypercar francés con motor W16 quad-turbo. La máxima expresión de lujo y velocidad.',
      currentPhotoIndex: 0,
      fechaSubida: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Hace 1 semana
    }
  ];

  private touchStartY = 0;
  private touchEndY = 0;
  private isScrolling = false;

  ngOnInit() {
    this.setupTouchEvents();
    this.setupScrollEvents();
    this.setupKeyboardEvents();
    this.startTimeUpdates();
  }

  ngOnDestroy() {
    this.removeTouchEvents();
    this.removeScrollEvents();
    this.removeKeyboardEvents();
    this.stopTimeUpdates();
  }

  // Función para calcular el tiempo transcurrido como Instagram
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

  // Actualizar timestamps cada minuto
  private startTimeUpdates() {
    this.timeUpdateInterval = setInterval(() => {
      // Forzar actualización de la vista
    }, 60000); // Cada minuto
  }

  private stopTimeUpdates() {
    if (this.timeUpdateInterval) {
      clearInterval(this.timeUpdateInterval);
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

  private setupTouchEvents() {
    const container = this.storiesContainer.nativeElement;
    
    container.addEventListener('touchstart', this.handleTouchStart.bind(this), { passive: true });
    container.addEventListener('touchend', this.handleTouchEnd.bind(this), { passive: true });
  }

  private removeTouchEvents() {
    const container = this.storiesContainer.nativeElement;
    
    container.removeEventListener('touchstart', this.handleTouchStart.bind(this));
    container.removeEventListener('touchend', this.handleTouchEnd.bind(this));
  }

  private setupScrollEvents() {
    const container = this.storiesContainer.nativeElement;
    container.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
  }

  private removeScrollEvents() {
    const container = this.storiesContainer.nativeElement;
    container.removeEventListener('scroll', this.handleScroll.bind(this));
  }

  private setupKeyboardEvents() {
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private removeKeyboardEvents() {
    document.removeEventListener('keydown', this.handleKeyDown.bind(this));
  }

  private handleKeyDown(event: KeyboardEvent) {
    switch(event.key) {
      case 'ArrowDown':
        event.preventDefault();
        this.scrollToNextAuto();
        break;
      case 'ArrowUp':
        event.preventDefault();
        this.scrollToPreviousAuto();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.previousPhoto(this.currentAutoIndex());
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.nextPhoto(this.currentAutoIndex());
        break;
    }
  }

  private handleTouchStart(event: TouchEvent) {
    this.touchStartY = event.touches[0].clientY;
  }

  private handleTouchEnd(event: TouchEvent) {
    this.touchEndY = event.changedTouches[0].clientY;
    this.handleSwipe();
  }

  private handleSwipe() {
    const swipeThreshold = 50;
    const swipeDistance = this.touchStartY - this.touchEndY;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0) {
        // Swipe up - next auto
        this.scrollToNextAuto();
      } else {
        // Swipe down - previous auto
        this.scrollToPreviousAuto();
      }
    }
  }

  private handleScroll() {
    if (this.isScrolling) return;
    
    const container = this.storiesContainer.nativeElement;
    const scrollTop = container.scrollTop;
    const windowHeight = window.innerHeight;
    
    const currentIndex = Math.round(scrollTop / windowHeight);
    this.currentAutoIndex.set(Math.max(0, Math.min(currentIndex, this.autos.length - 1)));
  }

  private scrollToNextAuto() {
    const currentIndex = this.currentAutoIndex();
    if (currentIndex < this.autos.length - 1) {
      this.scrollToAuto(currentIndex + 1);
    }
  }

  private scrollToPreviousAuto() {
    const currentIndex = this.currentAutoIndex();
    if (currentIndex > 0) {
      this.scrollToAuto(currentIndex - 1);
    }
  }

  private scrollToAuto(index: number) {
    this.isScrolling = true;
    const container = this.storiesContainer.nativeElement;
    const targetScrollTop = index * window.innerHeight;
    
    container.scrollTo({
      top: targetScrollTop,
      behavior: 'smooth'
    });

    this.currentAutoIndex.set(index);
    
    setTimeout(() => {
      this.isScrolling = false;
    }, 500);
  }
}