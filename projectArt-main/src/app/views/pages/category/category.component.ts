import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent {
  cards = [
    { name: 'Pintura', image: 'assets/pintura.png', type: 'pintura' },
    { name: 'Escultura', image: 'assets/escultura.png', type: 'escultura' },
    { name: 'Arte Callejero', image: 'assets/artecallejero.png', type: 'artecallejero' },
    { name: 'Cerámica', image: 'assets/ceramica.png', type: 'ceramica' },
    { name: 'Otro', image: 'assets/otro.png', type: 'otro' },
    { name: 'Dibujo', image: 'assets/dibujo.png', type: 'dibujo' }
  ];

  constructor(private router: Router) {}

  navigateToType(type: string): void {
    this.router.navigate(['/store'], { queryParams: { type } });
  }
}