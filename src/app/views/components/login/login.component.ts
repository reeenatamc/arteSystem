import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../model/auth.service';
import { LoadingService } from '../../../services/loading.service';
import { FirebaseError } from '@angular/fire/app'; // Asegúrate de que esta importación es correcta

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;
  // Hacemos la propiedad pública para que sea accesible desde la plantilla
  public loadingService: LoadingService;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private _loadingService: LoadingService // Inyectamos el LoadingService con un nombre diferente para evitar conflictos
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    // Asignamos el servicio inyectado a la propiedad pública
    this.loadingService = _loadingService;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      try {
        // Mostramos el indicador de carga antes de intentar iniciar sesión
        this.loadingService.show();
        
        await this.authService.login(email, password);
        // Manejar el login exitoso
        this.loadingService.hide();
        // Aquí podrías añadir la lógica para redirigir al usuario después de un login exitoso
      } catch (error) {
        // Ocultamos el indicador de carga
        this.loadingService.hide();
        // Manejamos el error de manera más específica
        console.error('Login error:', error);
  
        if (error instanceof Error) {
          switch (error.message) {
            case 'Firebase: Error (auth/invalid-email).':
              this.errorMessage = 'Email incorrecto';
              break;
            case 'Firebase: Error (auth/user-not-found).':
            case 'Firebase: Error (auth/wrong-password).':
              this.errorMessage = 'Contraseña incorrecta';
              break;
            default:
              this.errorMessage = 'Credenciales incorrectas';
          }
        } else {
          this.errorMessage = 'Ha ocurrido un error inesperado';
        }
        // Mostramos una alerta con el mensaje de error
        alert(this.errorMessage);
      }
    }
  }
}