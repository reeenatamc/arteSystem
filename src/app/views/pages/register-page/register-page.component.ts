import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { User } from '../../../interfaces/user.model';
import { FirebaseService } from '../../../model/firebase.service';
import { SupabaseService } from '../../../model/supabase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.css']
})
export class RegisterPageComponent implements OnInit {
  registerForm: FormGroup;
  role!: string;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private afAuth: AngularFireAuth,
    private userService: FirebaseService,
    private supabaseService: SupabaseService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      image: [''],
      description: [''],
      phone: ['', [Validators.required]],
      skills: ['']
    });
  }

  ngOnInit(): void {
    this.role = this.route.snapshot.queryParamMap.get('role') || '';
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    const { username, email, password, description, skills, phone } = this.registerForm.value;

    try {
      let imageUrl = '';
      if (this.selectedFile) {
        imageUrl = await this.supabaseService.uploadImage(this.selectedFile);
      }

      const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
      const uid = userCredential.user ? userCredential.user.uid : '';
      const newUser: User = {
        id: "",
        name: username,
        email,
        phone: phone,
        uid,
        image: imageUrl,
        role: this.role,
        description,
        skills: skills.split(',').map((skill: string) => ({ name: skill.trim() })) // Assuming skills are comma-separated
      };
      await this.userService.saveUser(newUser);
      alert('Usuario registrado correctamente');
    this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error registering user:', error);
    }
  }
}