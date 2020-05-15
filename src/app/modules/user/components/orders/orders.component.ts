import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/shared/services/user.service';
import { AuthSubjectService } from 'src/app/shared/services/state-managment/auth-subject.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})

export class OrdersComponent implements OnInit {
  orders = [];
  flag: boolean = true;
  private sub1: any;

  constructor(private toastr: ToastrService, private user: UserService, private authSubjectService: AuthSubjectService) {
  }

  ngOnInit(): void {
    this.user.getorder().subscribe(orders => {
      this.flag = false;
      this.orders = orders
    });
  }

  deleteOrder(order) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will remove this order!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Remove',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.value) {
        this.sub1 = this.user.deleteOrder(order.orderId).subscribe(result => {
          if (result.success == true) {
            Swal.fire(
              'Removed!',
              'Your order has been removed.',
              'success'
            )
            this.orders = this.orders.filter(o => {return o.orderId != order.orderId});
          }
          else {
            this.toastr.error("order did not delete", "Error")
          }
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'Your order is safe :)',
          'error'
        )
      }
    })
  }

  ngOnDestroy() {
    this.sub1?.unsubscribe();
  }

}

