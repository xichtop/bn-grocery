import { PageNotFoundComponent } from './shared/page-not-found/page-not-found.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, CanActivate } from '@angular/router';
import { HomeComponent } from './partial/home/home.component';
import { AuthGuard } from './partial/auth/auth.guard';


const routes: Routes = [
  { path: '', redirectTo: 'product', pathMatch: 'full'},
  // { path: 'home', component: HomeComponent },
  { path: 'product', 
    loadChildren: () => import('./partial/product/product.module').then(mod => mod.ProductModule),
    // canActivate: [AuthGuard]
  },
  { path: 'auth', loadChildren: () => import('./partial/auth/auth.module').then(mod => mod.AuthModule) },
  { path: '**', component: PageNotFoundComponent}
  // { path: '**', redirectTo: 'home'}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
