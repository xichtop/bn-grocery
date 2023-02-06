import { NotifierService } from 'angular-notifier';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore';
import { Subject } from 'rxjs';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { categories, units } from './../../../../assets/data/selections';
import { Product } from './../product.model';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ConfirmComponent } from '../../../shared/confirm/confirm.component';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject();
  private productId = '1';

  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    category: new FormControl({value: '', disabled: true}, Validators.required),
    unit: new FormControl({value: '', disabled: true}, Validators.required),
    number: new FormControl(1, Validators.compose([Validators.required, Validators.min(1)])),
    price: new FormControl(10000, Validators.compose([Validators.required, Validators.min(500)])),
  });

  categories = categories;
  units = units;

  private productDocument: AngularFirestoreDocument<Product>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    public dialog: MatDialog,
    private notifierService: NotifierService,
  ) { 
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.productId = params.id;
    })

    this.productDocument = this.afs.doc<Product>(`products/${this.productId}`);
    this.productDocument.valueChanges({ idField: 'id' })
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        const productItem = res as Object;
        this.productForm.patchValue(productItem);
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: "Sửa sản phẩm!",
        content: "Bạn có chắc chắn muốn sửa sản phẩm này hay không?"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        try {
          this.productDocument.update(this.productForm.value);
          this.notifierService.notify('success', 'Sửa sản phẩm thành công!');
          this.router.navigate(['../../list'], { relativeTo: this.route });
        } catch (error) {
          console.log(error);
          this.notifierService.notify('error', 'Sửa sản phẩm thất bại! Vui lòng thử lại sau.');
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['../../list'], { relativeTo: this.route});
  }

}
