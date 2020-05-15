import { Component, OnInit } from '@angular/core';
import { DetailsService } from '../../services/details.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthSubjectService } from '../../services/state-managment/auth-subject.service';
import { SafeResourceUrl, DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-productdetail',
  templateUrl: './productdetail.component.html',
  styleUrls: ['./productdetail.component.css']
})

export class ProductdetailComponent implements OnInit {
  id
  product;
  isAdmin = false;
  isAuth = false;
  productPhoto: SafeResourceUrl;
  private sub1: any;
  private sub2: any;
  private sub3: any;

  constructor(private sanitizer:DomSanitizer, private authSubjectService: AuthSubjectService, private user: UserService, private route: ActivatedRoute, private detail: DetailsService, private toastr: ToastrService) {
    this.isAuth = this.authSubjectService.current().isAuth;
    this.isAdmin = this.authSubjectService.current().isAdmin;
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.sub2 = this.detail.getProductDetail(this.id).subscribe(results => {
      if (!results.Errors) {
        this.product = results;
        this.productPhoto = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + this.product.imageUrl);
      }
    },
      (error) => {
        this.toastr.error("Something went wrong", 'Error!')
      })
  }

  addproduct(id) {
    let prod = { "productId": id }
    this.sub3 = this.user.addtocart(prod).subscribe(result => {
      if (result.success) {
        this.toastr.success('Product added to cart successfully', 'Success');
      }
      else
        this.toastr.error("not added", 'Error!')
    })
  }

  ngOnDestroy() {
    this.sub1?.unsubscribe();
    this.sub2?.unsubscribe();
    this.sub3?.unsubscribe();
  }

}
