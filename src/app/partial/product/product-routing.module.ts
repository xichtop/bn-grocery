import { PageNotFoundComponent } from './../../shared/page-not-found/page-not-found.component';
import { AddProductComponent } from './add-product/add-product.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductComponent } from './product.component';
import { EditProductComponent } from './edit-product/edit-product.component';

const routes: Routes = [
  { path: '', redirectTo: 'list', pathMatch: 'full'},
  { path: 'list', component: ProductComponent },
  { path: 'add', component: AddProductComponent },
  { path: 'edit/:id', component: EditProductComponent },
  { path: '**', component: PageNotFoundComponent}
  // { path: '**', redirectTo: 'list'}
]

@NgModule({
  declarations: [],
  imports: [
    RouterModule.forChild(routes)
  ]
})
export class ProductRoutingModule { }
