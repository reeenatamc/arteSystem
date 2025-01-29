import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './views/components/header/header.component';
import { FooterComponent } from './views/components/footer/footer.component';
import { LoginComponent } from './views/components/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginPage } from './views/pages/login/login.component';
import { RegisterPageComponent } from './views/pages/register-page/register-page.component';
import { LandingPageComponent } from './views/pages/landing-page/landing-page.component';
import { AngularFireModule } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { UploadPieceComponent } from './views/pages/uploadpiece-page/uploadpiece-page.component';
import { CategoryComponent } from './views/pages/category/category.component';
import { StoreComponent } from './views/pages/store/store.component';
import { CartComponent } from './views/pages/cart-component/cart-component.component';
import { CheckComponent } from './views/pages/check/check.component';
import { ArtistsComponent } from './views/pages/artists/artists.component';
import { ArtistProfileComponent } from './views/pages/artist-profile/artist-profile.component';
import { PieceInfoComponent } from './views/pages/piece-info/piece-info.component';
import { MisPedidospageComponent } from './views/pages/mis-pedidospage/mis-pedidospage.component';
import { ReviewsComponent } from './views/pages/reviews/reviews.component';
import { ViewreviewsComponent } from './views/pages/viewreviews/viewreviews.component';
import { UsersManagementComponent } from './views/pages/users-management/users-management.component';
import { PaymentsManagementComponent } from './views/pages/payments-management/payments-management.component';
import { PieceManagementComponent } from './views/pages/piece-management/piece-management.component';
import { UserProfileComponent } from './views/pages/user-profile/user-profile.component';
import { ArtistEditProfileComponent } from './views/pages/artist-edit-profile/artist-edit-profile.component';
import { LoadingSpinnerComponent } from './views/components/loading-spinner/loading-spinner.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    LoginPage,
    RegisterPageComponent,
    LandingPageComponent,
    UploadPieceComponent,
    CategoryComponent,
    StoreComponent,
    CartComponent,
    CheckComponent,
    ArtistsComponent,
    ArtistProfileComponent,
    PieceInfoComponent,
    MisPedidospageComponent,
    ReviewsComponent,
    ViewreviewsComponent,
    UsersManagementComponent,
    PaymentsManagementComponent,
    PieceManagementComponent,
    UserProfileComponent,
    ArtistEditProfileComponent,
    LoadingSpinnerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
