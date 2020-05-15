import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DetailsService } from 'src/app/shared/services/details.service';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css']
})
export class OrdersComponent implements OnInit {
  orders = [];
  flag: boolean = true;
  private sub1: any;
  private sub2: any;

  constructor(private toastr: ToastrService, private detail: DetailsService) {
  }

  ngOnInit(): void {
    this.sub1 = this.detail.getallorders().subscribe(res => {
      this.flag = false;
      this.orders = res;
    });
  }

  changeState(orderId, status) {
    this.sub2 = this.detail.manipulateorder(orderId, status).subscribe(res => {
      if (res["success"] == true) {
        this.toastr.success("order state changed successfully", "Success");
        for(let i = 0; i < this.orders.length; i++){
          if(this.orders[i].orderId == orderId){
            this.orders[i].status = status;
          }
        }
      }
      else
        this.toastr.error("error", "error")
    })
  }
  
  ngOnDestroy() {
    this.sub1?.unsubscribe();
    this.sub2?.unsubscribe();
  }

}
