import { Component, OnInit, Output } from '@angular/core';
import { VisitorsService } from '../../services/visitors.service';
import { ToastrService } from 'ngx-toastr';
import { AuthSubjectService } from '../../services/state-managment/auth-subject.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isAdmin = false;
  isAuth = false;
  subscriber;
  products
  number
  private sub1: any;
  private sub2: any;

  constructor(private sanitizer:DomSanitizer, private authSubjectService: AuthSubjectService, private toastr: ToastrService, private visitor: VisitorsService) { }

  ngOnInit(): void {
    this.isAuth = this.authSubjectService.current().isAuth;
    this.isAdmin = this.authSubjectService.current().isAdmin;

    this.sub2 = this.subscriber = this.visitor.getSomeProducts()
      .subscribe(results => {
        if (!results.Errors) {
          this.products = results.products;
          this.products.forEach(product => {
            if(product.imageUrl != '')
              product.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + product.imageUrl);
          })
          this.number = results.totalCount;
        }
      },
        (error) => {
          this.toastr.error(error, 'Error!')
        })
  }

  ngOnDestroy() {
    this.sub1?.unsubscribe();
    this.sub2?.unsubscribe();
  }

}
