

// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { UserService } from '../services/user.service';
// import { AuthenticationService } from '../services/authentication.service';
// // import { NewsService } from '../services/news.service'; 
// // import { AuthService } from '../services/auth.service'; 
// import { ActivatedRoute, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { ReactiveFormsModule } from '@angular/forms';
// import { MatDialogRef } from '@angular/material/dialog';
// import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
// import { NzUploadModule } from 'ng-zorro-antd/upload';
// import { MAT_DIALOG_DATA } from '@angular/material/dialog';
// import { Inject } from '@angular/core';
// import { NotificationHelper } from '../commons/notification';

// @Component({
//   selector: 'app-trainer-update',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule, NzUploadModule],
//   templateUrl: './trainer-update.component.html',
//   styleUrl: './trainer-update.component.css'
// })
// export class TrainerUpdateComponent {

//   memberform!: FormGroup;
//   templeId:any;
//   bannerFileList: NzUploadFile[] = [];
//   profilePicFileList: NzUploadFile[] = [];
//   certificateFileList: NzUploadFile[] = [];
//   isMember=false;
//   isMemberIn=false;
//   ConnectForm!:FormGroup;
//   villageid: any;




//   constructor(
//     private userservice: UserService,
//     private fb: FormBuilder,
//     private notificationHelper: NotificationHelper,  
    
    
//     @Inject(MAT_DIALOG_DATA) public data: any,
//     public dialogRef: MatDialogRef<TrainerUpdateComponent>
//   ) {
//     this.templeId = data.templeId; 
//     console.log(this.templeId,"ffffsfd")
//   }

//   ngOnInit():void{
//     this.initializeForm()
//     // this.connectionsForm();
//     this.isMemberUser();
  
//   }



  
//   initializeForm(): void {
//     console.log("wdefrgbh")
//     this.memberform = this.fb.group({
//       full_name: ["", Validators.required],
//       father_name: ["", Validators.required],
//       // user_type: ['ADMIN'],
//       // training_type: 'offline',
//       training_type: ['offline',Validators.required],

//       email: ['',Validators.required],
//       contact_number: ['',Validators.required],
//       temple: this.templeId,
//       user : localStorage.getItem('user'),
//       // dob:['',Validators.required],
//       certificate:['',Validators.required],
//       gender:['MALE',Validators.required],

//       // profile_pic:['',Validators.required],
      
//     });
   
//   }


// //   onSubmit(): void {   
// //     const userId = localStorage.getItem('user');      
// //     const connectdata  = this.memberform.value; 
// //     this.userservice.memberupdate(connectdata, userId).subscribe(
// //       response => {
// //         console.log('Member added successfully:', response);
// //         this.notificationHelper.showSuccessNotification('Add Member Success', '');
// //         this.memberform.reset();
// //         this.dialogRef.close();
// //       },
// //       error => {
// //         console.error('Error adding member:', error);
// //         this.memberform.markAllAsTouched();
// //       }
// //     );
// // }

// onSubmit(): void {
//   if (localStorage.getItem('is_member') === 'false') {

//     const userId = localStorage.getItem('user');
//     console.log(userId, "uuuuuuuuuuuuu");
//     const { full_name, father_name, contact_number, gender, ...memberData } = this.memberform.value;

//     this.userservice.memberupdate(memberData, userId).subscribe(
//       response => {
//         console.log('Member added successfully:', response);
//         localStorage.setItem('is_member', 'true');
//         this.memberform.reset();
//         this.dialogRef.close();

//       },
//       error => {
//         console.error('Error adding member:', error);
//         this.memberform.markAllAsTouched();

//       }
//     );

// }
// }

// isMemberUser() {
//   const isMemberIn = localStorage.getItem("is_member") === "true";
// if (isMemberIn) {
//   this.isMemberIn = true
// } else {
//   this.isMemberIn = false
// } 
// }
// // connectionsForm(): void {
// //   this.ConnectForm = this.fb.group(
// //     {
// //     belongs_as: this.fb.array([]),
// //     description: [''],
// //     village: this.villageid, 
// //     user : localStorage.getItem('user')
// //     }
// //   );
// // }

// handleFileChange(info: NzUploadChangeParam, formControlName: string): void {
//   this.handleUpload(info, formControlName);
// }

// handleUpload(info: NzUploadChangeParam, formControlName: string): void {
//   const fileList = [...info.fileList];

//   fileList.forEach((file: NzUploadFile) => {
//     if (file.originFileObj) {
//       this.getBase64(file.originFileObj, (base64String: string) => {
//         file['base64'] = base64String;
//         this.memberform.patchValue({ [formControlName]: base64String });
//       });
//     }
//   });

//   this.memberform.get(formControlName)?.setValue(fileList);

//   if (formControlName === 'profile_pic') {
//     this.profilePicFileList = fileList;
//   } else if (formControlName === 'certificate') {
//     this.certificateFileList = fileList;
//   }
// }

// getBase64(file: File, callback: (base64String: string) => void): void {
//   const reader = new FileReader();
//   reader.onload = () => {
//     let base64String = reader.result as string;
//     base64String = base64String.split(',')[1];
//     console.log('Base64 string:', base64String); 
//     callback(base64String);
//   };
//   reader.readAsDataURL(file);
// }
// }




import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NotificationHelper } from '../commons/notification';

@Component({
  selector: 'app-trainer-update',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, NzUploadModule],
  templateUrl: './trainer-update.component.html',
  styleUrls: ['./trainer-update.component.css'] 
})
export class TrainerUpdateComponent implements OnInit {

  memberform!: FormGroup;
  connectForm!: FormGroup;
  templeId: any;
  certificateFileList: NzUploadFile[] = [];
  isMemberIn: boolean = false; // Change this according to your logic

  constructor(
    private userservice: UserService,
    private fb: FormBuilder,
    private notificationHelper: NotificationHelper,  
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TrainerUpdateComponent>
  ) {
    this.templeId = data.templeId; 
    console.log('Temple ID:', this.templeId);
  }

  ngOnInit(): void {
    this.isMemberUser();
    this.initializeForms();
  }


  initializeForms(): void {
    this.memberform = this.fb.group({
      full_name: [""],
      father_name: ["", Validators.required],
      user_type: ['ADMIN'],
      training_type: ['offline', Validators.required],
      email: [''],
      contact_number: ['', Validators.required],
      temple: [this.templeId],
      user: [localStorage.getItem('user')],
      certificate: ['', Validators.required],
      gender: ['MALE', Validators.required],
      is_member:'true'
    });

    this.connectForm = this.fb.group({
      user_type: ['ADMIN'], 
      certificate: [null, Validators.required],
      user: [localStorage.getItem('user')],
      temple: [this.templeId],
    });
  }


  isMemberUser(): void {
    this.isMemberIn = localStorage.getItem("is_member") === "true";
  }


  onSubmit(): void {
    if (!this.isMemberIn) {
      console.log("qwdefh")
      if (this.memberform.invalid) {
        this.memberform.markAllAsTouched();
        return;
      }

      const userId = localStorage.getItem('user');      
      const memberData = this.memberform.value; 

      this.userservice.memberupdate(memberData, userId).subscribe(
        response => {
          console.log('Trainer added successfully:', response);
          this.notificationHelper.showSuccessNotification('Trainer Registration Successful', '');
          localStorage.setItem('is_member', 'true');
          this.memberform.reset();
          this.dialogRef.close();
        },
        error => {
          console.error('Error adding member:', error);
          this.memberform.markAllAsTouched();
          this.notificationHelper.showErrorNotification('Trainer Registration Failed', 'Please try again.');
        }
      );
    } else {
      if (this.connectForm.invalid) {
        this.connectForm.markAllAsTouched();
        return;
      }

      const userId = localStorage.getItem('user');      
      const updateData = this.connectForm.value; 

      this.userservice.memberupdate(updateData, userId).subscribe(
        response => {
          console.log('Trainer updated successfully:', response);
          this.notificationHelper.showSuccessNotification('Trainer Update Successful', '');
          this.connectForm.reset();
          this.dialogRef.close();
        },
        error => {
          console.error('Error updating Trainer:', error);
          this.connectForm.markAllAsTouched();
          this.notificationHelper.showErrorNotification('Trainer Update Failed', 'Please try again.');
        }
      );
    }
  }


  handleFileChange(info: NzUploadChangeParam, formControlName: string): void {
    this.handleUpload(info, formControlName);
  }


  handleUpload(info: NzUploadChangeParam, formControlName: string): void {
    const fileList = [...info.fileList];

    fileList.forEach((file: NzUploadFile) => {
      if (file.originFileObj) {
        this.getBase64(file.originFileObj, (base64String: string) => {
          file['base64'] = base64String;
          if (!this.isMemberIn) {
            this.memberform.patchValue({ [formControlName]: base64String });
          } else {
            this.connectForm.patchValue({ [formControlName]: base64String });
          }
        });
      }
    });

    if (formControlName === 'certificate') {
      this.certificateFileList = fileList;
      if (!this.isMemberIn) {
        this.memberform.get('certificate')?.setValue(fileList);
      } else {
        this.connectForm.get('certificate')?.setValue(fileList);
      }
    }
  }


  getBase64(file: File, callback: (base64String: string) => void): void {
    const reader = new FileReader();
    reader.onload = () => {
      let base64String = reader.result as string;
      base64String = base64String.split(',')[1];
      console.log('Base64 string:', base64String); 
      callback(base64String);
    };
    reader.readAsDataURL(file);
  }
}
