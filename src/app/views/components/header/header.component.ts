import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService } from '../../../model/auth.service';
import { User } from '../../../interfaces/user.model';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  currentUser: User | null = null;
  options: { label: string, route: string }[] = [];
  activeRoute: string = '';

  constructor(private authService: AuthService, private router: Router) {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: NavigationEnd) => {
      this.activeRoute = event.urlAfterRedirects;
    });
  }

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.setOptionsBasedOnRole();
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  setOptionsBasedOnRole(): void {
    if (this.currentUser) {
      switch (this.currentUser.role) {
        case 'client':
          this.options = [
            { label: 'Arte', route: '/clientHome' },
            { label: 'Tienda', route: '/store' },
            { label: 'Artistas', route: '/artists' },
            { label: 'Pedidos', route: '/orders' },
            { label: 'Reseñas', route: '/myreviews' },
            { label: 'Perfil', route: '/userprofile' }
          ];
          break;
        case 'artist':
          this.options = [
            { label: 'Home', route: '/home' },
            { label: 'Arte', route: '/profileartist' },
            { label: 'Publicar', route: '/uploadPiece'},         
          ];
          break;
        case 'admin':
          this.options = [
            { label: 'Usuarios', route: '/usersManagement' },
            { label: 'Pagos', route: '/paymentsManagement' },
            { label: 'Obras', route: '/pieceManagement' },  
            { label: 'Reseñas', route: '/myreviews' },
          ];
          break;
        case null:
          this.options = [
            { label: 'Iniciar sesión', route: '/login' },
          ];
          break;
        default:
          this.options = [
            { label: 'Iniciar sesión', route: '/login' }
          ];
          break;
      }
    }
  }

  logout(): void {
    this.authService.logout();
    this.options = [
    ];
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isActive(route: string): boolean {
    return this.activeRoute === route;
  }
}