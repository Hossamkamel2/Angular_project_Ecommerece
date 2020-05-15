import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { DetailsService } from 'src/app/shared/services/details.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  @ViewChild('submitBtn') submitBtn: ElementRef;
  preview: string;
  imageSizeError: boolean = false;
  imageFormatError: boolean = false;
  private sub1: any;
  private baseUrl: string = environment.domainUrl;

  constructor(private toastr: ToastrService, private detail: DetailsService, private router: Router) { }

  ngOnInit(): void {
  }

  productform = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    price: new FormControl(1, [Validators.min(1), Validators.required]),
    imageUrl: new FormControl('')
  });

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

  get title() { return this.productform.get('title'); }
  get description() { return this.productform.get('description'); }
  get price() { return this.productform.get('price'); }
  get imageUrl() { return this.productform.get('imageUrl'); }

  addProduct() {
    this.submitBtn.nativeElement.innerHTML = "Loading...";
    this.submitBtn.nativeElement.disabled = true;
    this.sub1 = this.detail.postproduct(this.productform.value).subscribe(result => {
      this.submitBtn.nativeElement.innerHTML = "Submit";
      this.submitBtn.nativeElement.disabled = false;
      if (result["Status"] == 422) {
        result["Errors"].forEach(error => {
          this.toastr.error(error.errorMsg, 'Validation Error!');
        });
      }
      else {
        this.toastr.success("Added Successfully", "Success")
        this.router.navigateByUrl('/admin/products');
      }
    })
  }

  ngOnDestroy() {
    this.sub1?.unsubscribe();
  }

}

