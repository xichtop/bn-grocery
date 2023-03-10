import { NotifierService } from 'angular-notifier';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit, AfterViewInit, ViewChild, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Subject } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { Product } from './product.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmComponent } from '../../shared/confirm/confirm.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit, AfterViewInit, OnDestroy  {

  private productsCollection: AngularFirestoreCollection<Product>;
  products : Product[] = [];
  isAuth = false;

  columnsToDisplay: string[];
  dataSource = new MatTableDataSource<Product>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  private destroy$ = new Subject();

  constructor(
    private afs: AngularFirestore,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private notifierService: NotifierService,
  ) {
    this.productsCollection = this.afs.collection<Product>('products');
    this.productsCollection.valueChanges({idField: 'id'})
      .pipe(takeUntil(this.destroy$))
      .subscribe(result => {
        this.products = result;
        this.dataSource.data = this.products;
      });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.isAuth = this.authService.isAuth();
    if (this.isAuth) {
      this.columnsToDisplay = ['name', 'category', 'unit', 'number', 'price', 'action'];
    } else {
      this.columnsToDisplay = ['name', 'category', 'unit', 'number', 'price'];
    }
  }

  doFilter(event: any): void {
    this.dataSource.filter = event.target.value.trim().toLowerCase();
  }

  onEditProduct(productId: string): void {
    this.router.navigate(['../edit/' + productId], { relativeTo: this.route });
  }

  onDeleteProduct(productId: string): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: "X??a s???n ph???m!",
        content: "B???n c?? ch???c ch???n mu???n x??a s???n ph???m n??y hay kh??ng?"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        try {
          const productDocument = this.afs.doc<Product>(`products/${productId}`);
          productDocument.delete();
          this.notifierService.notify('success', 'X??a s???n ph???m th??nh c??ng!');
        } catch (error) {
          console.log(error);
          this.notifierService.notify('error', 'X??a s???n ph???m th???t b???i! Vui l??ng th??? l???i sau.');
        }
      }
    });
  }

  onAddProduct(): void {
    this.router.navigate(['../add'], { relativeTo: this.route });
  }
}
