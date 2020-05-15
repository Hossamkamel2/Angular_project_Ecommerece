import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { UserService } from 'src/app/shared/services/user.service';
import { Gender } from 'src/app/shared/enums/gender'
@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent implements OnInit {
  toggle: boolean = false;
  imageSizeError: boolean = false;
  imageFormatError: boolean = false;
  preview: string;
  @Input() profile: any;
  @Input() closebutton: any;
  private sub1: any;


  constructor(private _formBuilder: FormBuilder, private toastr: ToastrService, private user: UserService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges():void{
    this.profileform.get('username').setValue(this.profile?.username)
    this.profileform.get('email').setValue(this.profile?.email)
    this.profileform.get('gender').setValue(this.profile?.gender)
    this.profileform.get('imageUrl').setValue(this.profile?.imageUrl)
    this.profileform.get('imageUrlBinary').setValue(this.profile?.imageUrlBinary)
  }

  profileform = this._formBuilder.group({
    username: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    gender: new FormControl('', [Validators.required]),
    imageUrl: new FormControl(''),
    imageUrlBinary: new FormControl(''),
  })

  get username() {  return this.profileform.get('username');}
  get email() { return this.profileform.get('email'); }
  get gender() { return this.profileform.get('gender'); }
  get imageurl() { return this.profileform.get('imageUrl'); }
  get imageUrlBinary() { return this.profileform.get('imageUrlBinary'); }

  save() {
    this.toggle = true;
    this.profileform.value.gender = Number.parseInt(this.profileform.value.gender);
    this.profileform.value.imageUrlBinary = this.profileform.value.imageUrlBinary == undefined ? '' : this.profileform.value.imageUrlBinary
    this.sub1 = this.user.editprofile(this.profileform.value).subscribe(result => {
      this.toggle = false;
      if (result["Status"] == 422) {
        result["Errors"].forEach(error => {
          this.toastr.error(error.errorMsg, 'Validation Error!');
        });
      }
      else {
        this.profile.username = this.profileform.get('username').value;
        this.profile.email = this.profileform.get('email').value; 
        this.profile.gender = this.profileform.get('gender').value; 
        this.profile.imageUrl = this.profileform.get('imageUrlBinary').value?.name == undefined ? '' : this.profileform.get('imageUrlBinary').value?.name;
        this.profile.imageUrlBinary = this.profileform.get('imageUrlBinary').value == undefined ? '' : this.profileform.get('imageUrlBinary').value;
        if(this.profile.imageUrlBinary?.name){
          const reader = new FileReader();
          reader.onload = () => {
            this.profile.imageUrlBinary = reader.result as string;
          }
          reader.readAsDataURL(this.profile.imageUrlBinary)
        }
        this.toastr.success("Edited Successfully", "Success")
        this.closebutton.click();
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

    this.profileform.patchValue({
      imageUrlBinary: file
    });
    this.profileform.get('imageUrlBinary').updateValueAndValidity()

    // File Preview
    const reader = new FileReader();
    reader.onload = () => {
      this.preview = reader.result as string;
    }
    reader.readAsDataURL(file)
  }

  ngOnDestroy() {
    this.sub1?.unsubscribe();
  }

}
