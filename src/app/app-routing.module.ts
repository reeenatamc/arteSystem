import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './views/pages/landing-page/landing-page.component';
import { LoginPage } from './views/pages/login/login.component';
import { RegisterPageComponent } from './views/pages/register-page/register-page.component';
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

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: LandingPageComponent },
  { path: 'login', component: LoginPage },
  { path: 'check', component: CheckComponent },
  { path: 'profileartist', component: ArtistProfileComponent },
  { path: 'register', component: RegisterPageComponent },
  //rutas del artista
  { path: 'uploadPiece', component: UploadPieceComponent },
  { path: 'pieceInfo', component: PieceInfoComponent },
  // rutas del cliente
  { path: 'clientHome', component: CategoryComponent },
  { path: 'myreviews', component: ViewreviewsComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'artists', component: ArtistsComponent },
  { path: 'store', component: StoreComponent },
  { path: 'cart', component: CartComponent },
  { path: 'orders', component: MisPedidospageComponent },
  { path: 'myreviews', component: ViewreviewsComponent },
  //rutas del admin
  { path: 'usersManagement', component: UsersManagementComponent },
  { path: 'paymentsManagement', component: PaymentsManagementComponent },
  { path: 'pieceManagement', component: PieceManagementComponent },
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
