import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  blogPosts: any = [
    {
      id: 1,
      title: 'Nuestras ofertas de temporada',
      excerpt: 'Descubre las mejores ofertas que tenemos para ti en esta temporada. No te pierdas nuestras promociones exclusivas.',
      date: '15 Jul 2026',
      category: 'Promociones',
      imagen: 'assets/img/blog/blog-1.jpg',
    },
    {
      id: 2,
      title: 'Guia de compra para celulares',
      excerpt: 'Encuentra el celular perfecto para tus necesidades. Te ayudamos a elegir el mejor equipo con nuestra guia completa.',
      date: '10 Jul 2026',
      category: 'Guias',
      imagen: 'assets/img/blog/blog-2.jpg',
    },
    {
      id: 3,
      title: 'Tendencias tecnologicas 2026',
      excerpt: 'Conoce las tendencias tecnologicas que marcaran el rumbo este ano. Desde inteligencia artificial hasta dispositivos smart.',
      date: '05 Jul 2026',
      category: 'Tecnologia',
      imagen: 'assets/img/blog/blog-3.jpg',
    },
  ];
}
