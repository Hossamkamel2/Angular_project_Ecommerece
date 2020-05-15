import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { DetailsService } from 'src/app/shared/services/details.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-product-edit',
  templateUrl: './product-edit.component.html',
  styleUrls: ['./product-edit.component.css']
})
export class ProductEditComponent implements OnInit {
  product;
  preview: string;
  imageSizeError: boolean = false;
  imageFormatError: boolean = false;
  toggle: boolean = false;
  productPhoto: SafeResourceUrl;
  @ViewChild('saveBtn') saveBtn: ElementRef;
  private sub1: any;
  private sub2: any;

  constructor(private sanitizer:DomSanitizer, private router: Router, private toastr: ToastrService, private route: ActivatedRoute, private detail: DetailsService) {
  }

  ngOnInit(): void {
    const id = this.route.snapshot.params.id;
    this.sub1 = this.detail.getProductDetail(id).subscribe(result => {
      if (result.Status != 404) {
        this.product = result;
        this.productPhoto = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + this.product.imageUrl);
        this.productform.get('_id').setValue(this.product?._id)
        this.productform.get('title').setValue(this.product?.title)
        this.productform.get('description').setValue(this.product?.description)
        this.productform.get('price').setValue(this.product?.price)
        this.productform.get('imageUrl').setValue(this.product?.imageUrl)
      }
      else {
        this.toastr.error("error", 'Error!');
      }
    })
  }

  uploadFile(event) {
    const file = (event.target as HTMLInputElement).files[0];
    if(file.size > 1024 * 1024 * 5)
      return this.imageSizeError = true;
    if(file.type != "image/jpeg" && file.type != "image/jpg" && file.type != "image/png")
      return this.imageFormatError = true;

    this.imageSizeError = false;
    this.imageFormatError = false;

    this.productform.patchValue({
      imageUrl: file
    });
    this.productform.get('imageUrl').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  productform = new FormGroup({
    _id: new FormControl(''),
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    price: new FormControl(1, [Validators.min(1), Validators.required]),
    imageUrl: new FormControl('')
  });

  get title() { return this.productform.get('title'); }
  get description() { return this.productform.get('description'); }
  get price() { return this.productform.get('price'); }
  get imageUrl() { return this.productform.get('imageUrl'); }

  save() {
    this.productform.value.title = this.productform.get('title').value;
    this.productform.value.description = this.productform.get('description').value;
    this.productform.value.price = this.productform.get('price').value;
    this.productform.value.imageUrl = this.productform.get('imageUrl').value;

    this.saveBtn.nativeElement.innerHTML = "Loading...";
    this.saveBtn.nativeElement.disabled = true;
    this.sub2 = this.detail.editproduct(this.productform.value).subscribe(result => {
      this.saveBtn.nativeElement.innerHTML = "Edit";
      this.saveBtn.nativeElement.disabled = false;
      if (result["Status"] == 422) {
        result["Errors"].forEach(error => {
          this.toastr.error(error.errorMsg, 'Validation Error!');
        });
      }
      else {
        this.toastr.success("Edited Successfully", "Success")
        this.router.navigateByUrl('/admin/products');
      }
    })
  }

  ngOnDestroy() {
    this.sub1?.unsubscribe();
    this.sub2?.unsubscribe();
  }
  
}
