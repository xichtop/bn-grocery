import { NotifierService } from 'angular-notifier';
import { Router, ActivatedRoute } from '@angular/router';
import { ConfirmComponent } from './../../../shared/confirm/confirm.component';
import { Validators, FormGroup, FormControl } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { categories, units } from './../../../../assets/data/selections';
import { Product } from './../product.model';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent implements OnInit, OnDestroy {

  private destroy$ = new Subject();
  private productsCollection: AngularFirestoreCollection<Product>;

  productForm = new FormGroup({
    name: new FormControl('', Validators.required),
    category: new FormControl('', Validators.required),
    unit: new FormControl({value: '', disabled: true}, Validators.required),
    number: new FormControl(1, Validators.compose([Validators.required, Validators.min(1)])),
    price: new FormControl(10000, Validators.compose([Validators.required, Validators.min(500)])),
  });
  categories = categories;
  units = units;

  constructor(
    private afs: AngularFirestore,
    public dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private notifierService: NotifierService,
  ) { 
    this.productsCollection = this.afs.collection<Product>('products');
  }

  ngOnInit(): void {
    this.productForm.get('category')!.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((val: string) => {
      if(val !== '') {
        this.units = units.filter(item => item.category === val);
        this.productForm.get('unit')!.enable();
        this.productForm.get('unit')!.setValue('');
      } else {
        this.productForm.get('unit')!.disable();
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSubmit(): void {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      data: {
        title: "Thêm sản phẩm mới!",
        content: "Bạn có chắc chắn muốn thêm sản phẩm này hay không?"
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        try {
          this.productsCollection.add(this.productForm.value);
          this.notifierService.notify('success', 'Thêm sản phẩm thành công!');
          this.router.navigate(['../list'], { relativeTo: this.route });
        } catch (error) {
          console.log(error);
          this.notifierService.notify('error', 'Thêm sản phẩm thất bại! Vui lòng thử lại sau.');
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['../list'], { relativeTo: this.route});
  }

}
