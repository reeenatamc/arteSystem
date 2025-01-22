import { Component } from '@angular/core';
import { AuthService } from '../../../model/auth.service';
import { User } from '../../../interfaces/user.model';


@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {
   currentUser: User | null = null;
  
    constructor(private authService: AuthService) {}
  
    ngOnInit(): void {
      this.authService.currentUser$.subscribe(user => {
        this.currentUser = user;
      });
    }
}
