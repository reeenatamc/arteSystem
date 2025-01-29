import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.css']
})
export class CategoryComponent implements OnInit {
  isLoading: boolean = true;  // Inicializamos el spinner como visible
  cards = [
    { name: 'Pintura', image: 'assets/pintura.png', type: 'pintura' },
    { name: 'Escultura', image: 'assets/escultura.png', type: 'escultura' },
    { name: 'Arte Callejero', image: 'assets/artecallejero.png', type: 'artecallejero' },
    { name: 'Cerámica', image: 'assets/ceramica.png', type: 'ceramica' },
    { name: 'Otro', image: 'assets/otro.png', type: 'otro' },
    { name: 'Dibujo', image: 'assets/dibujo.png', type: 'dibujo' }
  ];

  constructor(private router: Router, private loadingService: LoadingService) {}

  ngOnInit(): void {
    this.loadingService.show();
    
    setTimeout(() => {
      this.isLoading = false;  
      this.loadingService.hide();  
    }, 500);  
  }

  navigateToType(type: string): void {
    this.loadingService.show();  // Mostrar spinner antes de navegar
    this.router.navigate(['/store'], { queryParams: { type } });
  }
}



