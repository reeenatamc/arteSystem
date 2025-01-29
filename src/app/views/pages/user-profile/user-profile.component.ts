import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { AuthService } from '../../../model/auth.service';
import { SupabaseService } from '../../../model/supabase.service';
import { User } from '../../../interfaces/user.model';
import { NgModel } from '@angular/forms'; // Importación necesaria para NgModel
import { getAuth, updateEmail, updateProfile, sendEmailVerification } from 'firebase/auth';
import { LoadingService } from '../../../services/loading.service';


@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: User | null = null;
  isEditing: boolean = false;
  selectedImage: File | null = null;
  newSkill: string = '';
  previewImage: string | ArrayBuffer | null = null;
  isLoading: boolean = false;

  
  // Variables para el cambio de contraseña
  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('emailInput') emailInput!: NgModel;

  constructor(
    private authService: AuthService,
    private supabaseService: SupabaseService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.loadingService.show(); 

    this.authService.currentUser$.subscribe(user => {
      this.user = user;
    });

    this.loadingService.loading$.subscribe((isLoading) => {
      this.isLoading = isLoading;
    });

    // Simulamos la carga de los datos del formulario o algún recurso externo
    setTimeout(() => {
      // Ocultamos el spinner cuando el formulario y datos estén cargados
      this.loadingService.hide();
    }, 1000);

  }

  ngOnDestroy(): void {
    // Limpiamos la URL del objeto si se creó una vista previa
    if (this.previewImage && typeof this.previewImage === 'string') {
      URL.revokeObjectURL(this.previewImage);
    }
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing) {
      this.newSkill = ''; // Limpiar el campo de nueva habilidad al cancelar la edición
      this.resetPreviewImage();
    }
  }

  triggerImageUpload(): void {
    // Hacemos clic en el input de archivo oculto
    this.fileInput.nativeElement.click();
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      // Crear una vista previa de la imagen seleccionada
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        this.previewImage = e.target?.result as string | ArrayBuffer | null;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  
  async saveChanges(): Promise<void> {
    if (this.user) {
      // Validamos el email
      if (!this.emailInput.valid) {
        alert('No puedes cambiar el correo. Debe contener un @.');
        return;
      }
  
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
  
        if (currentUser) {
          // Actualizar el correo electrónico en Firebase Authentication si ha cambiado
          if (this.user.email !== currentUser.email) {
            await updateEmail(currentUser, this.user.email);
            // Envía el correo de verificación
            await sendEmailVerification(currentUser);
            alert('Se ha enviado un correo de verificación al nuevo correo electrónico. Por favor, verifícalo antes de continuar.');
            // No actualices Firestore hasta que el correo sea verificado
            return;
          }
  
          // Aquí iría el código para actualizar otras partes del perfil si es necesario
          // ...
  
          // Actualizar el usuario en Firestore usando el método del servicio
          await this.authService.updateUserInFirestore(this.user);
  
          this.isEditing = false;
          alert('Perfil actualizado con éxito');
        } else {
          throw new Error('No hay usuario autenticado');
        }
      } catch (error) {
        console.error('Error al guardar los cambios: ', error);
        let errorMessage = 'Hubo un error al intentar actualizar el perfil. Por favor, inténtalo de nuevo.';
        if (error instanceof Error) {
          errorMessage += ' Detalles: ' + error.message;
        }
        alert(errorMessage);
      }
    }
  }
  
  cancelChanges(): void {
    this.isEditing = false;
    this.resetPreviewImage();
    // Limpiar los campos de cambio de contraseña
    this.currentPassword = '';
    this.newPassword = '';
    this.confirmPassword = '';
  }


  private resetPreviewImage(): void {
    // Limpiamos la vista previa al cancelar
    if (this.previewImage && typeof this.previewImage === 'string') {
      URL.revokeObjectURL(this.previewImage);
    }
    this.previewImage = null;
  }

  // Método para cambiar la contraseña
  async changePassword(): Promise<void> {
    // Validación de la contraseña actual
    if (!await this.authService.verifyCurrentPassword(this.currentPassword)) {
      alert('La contraseña actual es incorrecta.');
      return;
    }

    // Validación de la nueva contraseña (mínimo 6 dígitos)
    if (this.newPassword.length < 6) {
      alert('La nueva contraseña debe tener al menos 6 dígitos.');
      return;
    }

    // Validación de que la nueva contraseña y la confirmación coincidan
    if (this.newPassword !== this.confirmPassword) {
      alert('La nueva contraseña y la confirmación no coinciden.');
      return;
    }

    try {
      // Cambiar la contraseña en el backend
      await this.authService.changePassword(this.newPassword);
      alert('Contraseña cambiada con éxito.');
      // Limpiar los campos después de un cambio exitoso
      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';
    } catch (error) {
      console.error('Error al cambiar la contraseña: ', error);
      alert('Hubo un error al intentar cambiar la contraseña.');
    }
  }
}