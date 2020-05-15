import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthSubjectService } from 'src/app/shared/services/state-managment/auth-subject.service';
import { DetailsService } from 'src/app/shared/services/details.service';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
  @ViewChild('checkOutBtn') checkOutBtn: ElementRef;
  @ViewChild('clearCartBtn') clearCartBtn: ElementRef;
  products = [];
  isAdmin;
  isAuth;
  items;
  total: number = 0;
  flag: boolean = true;
  private sub1: any;
  private sub2: any;
  private sub3: any;
  private sub4: any;
  private sub5: any;
  private sub6: any;
  private sub7: any;

  constructor(private toastr: ToastrService, private detail: DetailsService, private user: UserService, private authSubjectService: AuthSubjectService) {
  }

  ngOnInit(): void {
    this.isAuth = this.authSubjectService.current().isAuth;
    this.isAdmin = this.authSubjectService.current().isAdmin;

    this.user.getcartitems().subscribe(res => {
      this.items = res["items"];
      res["items"].forEach(element => {
        this.sub2 = this.detail.getProductDetail(element["productId"]).subscribe(result => {
          this.flag = false;
          result.quantity = element["quantity"];
          this.total += (result.price * element.quantity)
          this.products.push(result);
        })
      });
    });
  }

  checkOut() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to submit order ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Order',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.checkOutBtn.nativeElement.innerHTML = "Loading...";
        this.checkOutBtn.nativeElement.disabled = true;
        this.clearCartBtn.nativeElement.innerHTML = "Loading...";
        this.clearCartBtn.nativeElement.disabled = true;
        this.sub3 = this.user.checkout().subscribe(res => {
          this.checkOutBtn.nativeElement.innerHTML = "Checkout";
          this.checkOutBtn.nativeElement.disabled = false;
          this.clearCartBtn.nativeElement.innerHTML = "Clear Cart";
          this.clearCartBtn.nativeElement.disabled = false;
          if (res["success"] == true) {
            this.toastr.success('order added successfully', 'Success');
            this.products = [];
            this.total = 0;
          }
          else
            this.toastr.error("not added", 'Error!')
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your cart is safe :)',
          'error'
        )
      }
    })
  }

  clearCart() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You want to claer the cart ?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Clear',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.checkOutBtn.nativeElement.innerHTML = "Loading...";
        this.checkOutBtn.nativeElement.disabled = true;
        this.clearCartBtn.nativeElement.innerHTML = "Loading...";
        this.clearCartBtn.nativeElement.disabled = true;
        this.sub4 = this.user.clearCart().subscribe(res => {
          this.checkOutBtn.nativeElement.innerHTML = "Checkout";
          this.checkOutBtn.nativeElement.disabled = false;
          this.clearCartBtn.nativeElement.innerHTML = "Clear Cart";
          this.clearCartBtn.nativeElement.disabled = false;
          if (res["success"] == true) {
            this.toastr.success('Cart cleared successfully', 'Success');
            this.products = [];
            this.total = 0;
          }
          else
            this.toastr.error("not added", 'Error!')
        })
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your cart is safe :)',
          'error'
        )
      }
    })
  }

  addProduct(product) {
    let prod = { "productId": product._id }
    this.sub5 = this.user.addtocart(prod).subscribe(result => {
      if (result.success) {
        this.toastr.success('Product added to cart successfully', 'Success');
        for (let i = 0; i < this.products.length; i++) {
          if (this.products[i]._id == product["_id"]) {
            this.products[i].quantity++;
            this.total += this.products[i].price
            break;
          }
        }
      }
      else
        this.toastr.error("not added", 'Error!')
    })
  }

  reduceProduct(product) {
    this.sub6 = this.user.reduceitem(product._id).subscribe(result => {
      if (result["success"]) {
        this.toastr.success('Product reduced from cart successfully', 'Success');
        for (let i = 0; i < this.products.length; i++) {
          if (this.products[i]._id == product["_id"]) {
            this.products[i].quantity--;
            this.total -= this.products[i].price
            break;
          }
        }
      }
      else
        this.toastr.error("not deleted", 'Error!')
    })
  }

  removeProduct(product) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will remove this product from cart!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.sub7 = this.user.delcartprod(product._id).subscribe(result => {
          if (result["success"]) {
            Swal.fire(
              'Removed!',
              'Your product has been removed.',
              'success'
            )
            for (let i = 0; i < this.products.length; i++) {
              if (this.products[i]._id == product["_id"]) {
                this.total -= this.products[i].quantity * this.products[i].price;
                this.products[i].quantity = 0;
                break;
              }
            }
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

  ngOnDestroy() {
    this.sub1?.unsubscribe();
    this.sub2?.unsubscribe();
    this.sub3?.unsubscribe();
    this.sub4?.unsubscribe();
    this.sub5?.unsubscribe();
    this.sub6?.unsubscribe();
    this.sub7?.unsubscribe();
  }

}
