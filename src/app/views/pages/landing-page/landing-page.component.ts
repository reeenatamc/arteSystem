import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../model/auth.service';
import { User } from '../../../interfaces/user.model';
import { LoadingService } from '../../../services/loading.service';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  currentUser: User | null = null;
  isLoading: boolean = true;


  constructor(private authService: AuthService, private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.show();

    // Subscribirse al usuario actual
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    setTimeout(() => {
      this.isLoading = false;  // Desactivamos el spinner después de cargar las tarjetas
      this.loadingService.hide();  // Ocultamos el spinner
    }, 500); 
  }
}

