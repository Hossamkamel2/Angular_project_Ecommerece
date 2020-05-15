import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/shared/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile;
  private sub1: any;

  constructor(private sanitizer:DomSanitizer, private user: UserService, private toastr: ToastrService) {
    this.sub1 = this.user.profile().subscribe(res => {
      this.profile = res;
      if(this.profile.imageUrl != '')
        this.profile.imageUrlBinary = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/*;base64,' + this.profile.imageUrlBinary);
    })
  }

  ngOnInit(): void {
  }

  openModel(){
    const temp = { ...this.profile };
    this.profile = temp;
  }

  ngOnDestroy() {
    this.sub1?.unsubscribe();
  }
}
