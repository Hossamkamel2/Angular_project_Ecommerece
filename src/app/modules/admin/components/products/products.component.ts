import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { VisitorsService } from '../../../../shared/services/visitors.service';
import { AuthSubjectService } from '../../../../shared/services/state-managment/auth-subject.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user.service';
import Swal from 'sweetalert2'
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {
  @ViewChild('deleteBtn') deleteBtn: ElementRef;
  products: any[];
  allProducts: any[];
  isAdmin: boolean;
  isAuth: boolean;
  currentPage: number = 0;
  pageSize: number = 6;
  nameFilter: string = "";
  pages;
  private sub1: any;
  private sub2: any;
  private sub3: any;
  private sub4: any;

  constructor(private sanitizer:DomSanitizer, private user: UserService, private authSubjectService: AuthSubjectService, private toastr: ToastrService, private visitor: VisitorsService) { }

  ngOnInit(): void {
    this.isAuth = this.authSubjectService.current().isAuth;
    this.isAdmin = this.authSubjectService.current().isAdmin;

    this.sub2 = this.visitor.getAllproducts()
      .subscribe(results => {
        if (results) {
          this.allProducts = results;
          this.allProducts.forEach(product => {
            if(product.imageUrl != '')
              product.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + product.imageUrl);
          })
          this.products = this.allProducts.filter(product => product.title.toLowerCase().includes(this.nameFilter.toLowerCase())).sort((a, b) => b - a).slice(this.currentPage * this.pageSize, this.pageSize * (this.currentPage + 1));
          this.pages = new Array<number>(Math.ceil(this.allProducts.length / this.pageSize));
        }
      },
        (error) => {
          this.toastr.error("Something went wrong!", 'Error!')
        })
  }

  changePage(pageNum: number) {
    this.currentPage = pageNum;
    this.products = this.allProducts.filter(product => product.title.toLowerCase().includes(this.nameFilter.toLowerCase())).sort((a, b) => b - a).slice(this.currentPage * this.pageSize, this.pageSize * (this.currentPage + 1));
  }

  filterName() {
    this.products = this.allProducts.filter(product => product.title.toLowerCase().includes(this.nameFilter.toLowerCase())).sort((a, b) => b - a).slice(this.currentPage * this.pageSize, this.pageSize * (this.currentPage + 1));
    if (this.nameFilter != "")
      this.pages = new Array<number>(Math.ceil(this.products.length / this.pageSize));
    else
      this.pages = new Array<number>(Math.ceil(this.allProducts.length / this.pageSize));
  }

  delete(id) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to delete product ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.deleteBtn.nativeElement.disabled = true;
        this.sub3 = this.visitor.deleteProduct(id).subscribe(result => {
          this.deleteBtn.nativeElement.disabled = false;
          if (result.success) {
            this.toastr.success('Product deleted successfully', 'Success');
            this.products = this.products.filter(p => {return p._id != id})
          }
          else
            this.toastr.error("not deleted", 'Error!')
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your product is safe :)',
          'error'
        )
      }
    })
  }

  addpro(id, e) {
    e.target.innerHTML = "loadding...";
    e.target.disabled = true;
    let prod = { "productId": id }
    this.sub4 = this.user.addtocart(prod).subscribe(result => {
      e.target.innerHTML = "Add to cart";
      e.target.disabled = false;
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
    this.sub4?.unsubscribe();
  }

}
