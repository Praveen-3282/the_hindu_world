import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray, ReactiveFormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
// import { NgxSpinnerService, NgxSpinnerModule } from 'ngx-spinner';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { OrganizationsService } from '../services/organizations.service';
import { state } from '@angular/animations';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { NzUploadModule,NzUploadFile,NzUploadChangeParam } from 'ng-zorro-antd/upload';
import { Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';
import { AuthenticationService } from '../services/authentication.service';
import { NotificationHelper } from '../commons/notification';
import { TrainingService } from '../services/training.service';
import { EventService } from '../services/event.service';
import { MemberProfileComponent } from '../member-profile/member-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { PictureTwoTone } from '@ant-design/icons-angular/icons';

@Component({
  selector: 'app-add-event',
  standalone: true,
  imports: [
    CommonModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    NzUploadModule,NzIconModule,
  ],
    templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.css'
})
export class AddEventComponent {



  organizationForm!: FormGroup;
  templeCategoryOptions: any[] = [];
  templePriorityOptions: any[] = [];
  templeStyleOptions: any[] = [];
  containsLocationDetails = false;
  countries: any;
  templeCountryOptions: any[] = [];
  templeStateOptions: any[] = [];
  templeDistrictOptions: any[] = [];
  templeMandalOptions: any[] = [];
  templeVillageOptions: any[] = [];
  countryID:any[]=[];
  formGroup: any;
  bannerFileList: NzUploadFile[] = [];
  imageLocation: string = '';
  fileList: NzUploadFile[] = [];
  villagedata: any;
  villageid:any;
  selectedLocationId:any;
  ContinentOptions:any[]=[];
  countrydata: any;
  districtdata:any;
  CountryOptions: any[]=[];
  StateOptions: any[]=[];
  DistrictOptions: any[]=[];
  formDisabled = false;
  organizationsyOptions: any[]=[];



  combinedCategoryOptions: any[] = [];
  subcategoryToCategoryMap: { [key: string]: string } = {}; 
  CategoryOptions: any[] = [];

  // formGroup:any;

  constructor(private fb: FormBuilder,
    private organizationService: OrganizationsService,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
private eventservice:EventService,
    private formBuilder: FormBuilder,
    private router:Router,
    private dialog:MatDialog,
    private spinner: NgxSpinnerService,

    private notificationHelper: NotificationHelper,
  ) {

    this.organizationForm = this.fb.group({  

      object_id:['', [Validators.required]],
      name: ['', [Validators.required]],
      contact_details: ['', Validators.required],
      brochure: ['', Validators.required],
      event_images: [[], [Validators.required]],
      location: ['', [Validators.required]],  
      category: ['', Validators.required],     
      continent: ['', [Validators.required]],      
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      organizer_name: ['', [Validators.required]],
      // start_date: [new Date('2024-09-25T04:51:49.393Z')],
      // end_date: [new Date('2024-09-25T04:51:49.393Z')],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      
      
      // start_time: ['', [Validators.required]],
      // end_time: ['', [Validators.required]],
      live_stream_link: ['', [Validators.required]],
      // organization: ['', [Validators.required]],
      geo_site: ['DISTRICT'],
      status: ['PENDING'],
      user:localStorage.getItem('user'),
      event_details:['', [Validators.required]],
      sub_category:[''],
     });
   }

  ngOnInit() {
    this.fetchAllCategories();
    // this.fetchAllorganizations();



    this.organizationService.getContinents().subscribe(
      (res) => {
        // console.log(res,'kishsdhsjfdskfb'); 
        if (res && Array.isArray(res)) {
          this.ContinentOptions = res.map((continent: any) => ({
            label: continent.name,
            value: continent._id
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
        } else {
          console.error("Response is not in expected format", res);
        }
      },
      (err) => {
        console.error(err);
      }
    );
    



    this.organizationForm.get('continent')?.valueChanges.subscribe((continentID) => {
      console.log(continentID, "wdefrgh");
      if (continentID) {
        this.selectedLocationId = continentID; 
        console.log(continentID, "zaxsdfg");
        this.organizationService.getCountries(continentID).subscribe(
          data => {
            this.countrydata = data;
    
            console.log(this.countrydata, "this.countrydata");
    
            if (this.countrydata && typeof this.countrydata === 'object' && this.countrydata.countries && Array.isArray(this.countrydata.countries)) {
              this.CountryOptions = this.countrydata.countries.map((country: any) => ({
                label: country.name,
                value: country._id
              })).sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));
              console.log(this.CountryOptions, "2345678");
            } else {
              console.error("Response is not in expected format", this.countrydata);
            }
          },
          (err) => {
            console.error(err);
          }
        );
      }
    });
    

    this.organizationForm.get('country')?.valueChanges.subscribe((countryID) => {
      if (countryID) {
        this.selectedLocationId = countryID; 
        this.organizationService.getStates(countryID).subscribe(
          (data) => {
            this.countrydata = data;
    
            console.log(this.countrydata, "this.countrydata");
    
            if (this.countrydata && typeof this.countrydata === 'object' && this.countrydata.states && Array.isArray(this.countrydata.states)) {
              this.StateOptions = this.countrydata.states.map((state: any) => ({
                label: state.name,
                value: state._id
              })).sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));
              console.log(this.StateOptions, "State Options");
            } else {
              console.error("Response is not in expected format", this.countrydata);
            }
          },
          (err) => {
            console.error(err);
          }
        );

      }
    });
    

    this.organizationForm.get('state')?.valueChanges.subscribe((stateID) => {
      if (stateID) {
        this.selectedLocationId = stateID; 

        this.organizationService.getDistricts(stateID).subscribe(
          (data) => {
            this.districtdata = data;
    
            console.log(this.districtdata, "this.districtdata");
    
            if (this.districtdata && typeof this.districtdata === 'object' && this.districtdata.districts && Array.isArray(this.districtdata.districts)) {
              this.DistrictOptions = this.districtdata.districts.map((district: any) => ({
                label: district.name,
                value: district._id
              })).sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));
              console.log(this.DistrictOptions, "District Options");
            } else {
              console.error("Response is not in expected format", this.districtdata);
            }
          },
          (err) => {
            console.error(err);
          }
        );
      } else {
      }
    });

    this.organizationForm.get('district')?.valueChanges.subscribe(districtID => {
      if (districtID) {
        this.selectedLocationId = districtID; 
        console.log('district ID selected:', this.selectedLocationId);
      } else {
      }
    });
    
  }






  // onSubmit() {
  //   this.spinner.show();
  //   if (this.organizationForm.valid) {
      
  //     const formValue = { ...this.organizationForm.value };
  //     const startDateTime = new Date(`${formValue.start_date}T${formValue.start_time}`);
  //     const endDateTime = new Date(`${formValue.end_date}T${formValue.end_time}`);
  
  //     // You can format these as needed (e.g., ISO string, locale string, etc.)
  //     formValue.startDateTime = startDateTime.toISOString(); // Example: "2024-09-25T10:00:00Z"
  //     formValue.endDateTime = endDateTime.toISOString();     
      
  //     const selectedCategory = formValue.category;
  //     const selectedCategoryOption = this.combinedCategoryOptions.find(option => option.value === selectedCategory);
  
  //     if (selectedCategoryOption?.isSubcategory) {
  //       formValue.sub_category = selectedCategory;
  //       formValue.category = this.subcategoryToCategoryMap[selectedCategory];
  //     } else {
  //       formValue.sub_category = '';
  //     }
  
  //     console.log('Form value before submitting:', formValue);
  
  //     this.eventservice.addevent(formValue).subscribe(
  //       response => {
  //         console.log('Event added successfully:', response);
  //         this.notificationHelper.showSuccessNotification('Add Event Success', '');
  //         this.resetForm();
  //       },
  //       error => {
  //         console.error('Error adding event:', error);
  
  //         if (error.status === 400 && error.error.message === "Cannot create event. Membership details are required. Update your profile and become a member.") {
  //           this.notificationHelper.showErrorNotification('Event not added. Membership details are required.');
  //           console.log('Membership error. Opening member dialog.');
  //           this.openMemberDialog();
  //         } else {
  //           this.notificationHelper.showErrorNotification('Event not added.');
  //         }
  //       }
  //     );
  //   } else {
  //     this.organizationForm.markAllAsTouched();
  //     console.log('Form is invalid.');
  //     this.spinner.hide();
  //   }
  // }


  onSubmit() {
    this.spinner.show();
    if (this.organizationForm.valid) {
      const formValue = { ...this.organizationForm.value };
  
      // Parse the backend date strings directly
      // const startDateTime = new Date(formValue.start_date);
      // const endDateTime = new Date(formValue.end_date);
  
      // Validate date objects before converting to ISO
      // if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      //   this.notificationHelper.showErrorNotification('Invalid date or time format.');
      //   this.spinner.hide();
      //   return;
      // }
  
      // // Ensure time values are included if needed
      // if (formValue.start_time) {
      //   const [hours, minutes] = formValue.start_time.split(':');
      //   startDateTime.setHours(Number(hours));
      //   startDateTime.setMinutes(Number(minutes));
      // }
  
      // if (formValue.end_time) {
      //   const [hours, minutes] = formValue.end_time.split(':');
      //   endDateTime.setHours(Number(hours));
      //   endDateTime.setMinutes(Number(minutes));
      // }
  
      // formValue.startDateTime = startDateTime.toISOString();
      // formValue.endDateTime = endDateTime.toISOString();
      
      const selectedCategory = formValue.category;
      const selectedCategoryOption = this.combinedCategoryOptions.find(option => option.value === selectedCategory);
  
      if (selectedCategoryOption?.isSubcategory) {
        formValue.sub_category = selectedCategory;
        formValue.category = this.subcategoryToCategoryMap[selectedCategory];
      } else {
        formValue.sub_category = '';
      }
  
      console.log('Form value before submitting:', formValue);
  
      this.eventservice.addevent(formValue).subscribe(
        response => {
          console.log('Event added successfully:', response);
          this.notificationHelper.showSuccessNotification('Add Event Success', '');
          this.resetForm();
        },
        error => {
          console.error('Error adding event:', error);
  
          if (error.status === 400 && error.error.message === "Cannot create event. Membership details are required. Update your profile and become a member.") {
            this.notificationHelper.showErrorNotification('Event not added. Membership details are required.');
            console.log('Membership error. Opening member dialog.');
            this.openMemberDialog();
          } else {
            this.notificationHelper.showErrorNotification('Event not added.');
          }
        }
      );
    } else {
      this.organizationForm.markAllAsTouched();
      console.log('Form is invalid.');
      this.spinner.hide();
    }
  }
  
  
  openMemberDialog(): void {
    console.log('Opening member form dialog');
    const dialogRef = this.dialog.open(MemberProfileComponent, {
      data: { displayName: 'signup' },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
    });
  
    dialogRef.afterClosed().subscribe(() => {
      console.log('Member form dialog closed');
    });
  }
  


  resetForm() {
    this.organizationForm.reset();
    this.fileList = [];
    this.bannerFileList = [];
    this.brochureFileList =[];

    this.organizationForm.patchValue({
  image: ''
    });
  }


  
  // fetchAllCategories(): void {
  //   this.eventservice.geteventCategories().subscribe(
  //     (res) => {

  //       if (res && Array.isArray(res)) {
  //         this.CategoryOptions = res.map((subcategory: any) => ({
  //           label: subcategory.name,  
  //           value: subcategory._id    
  //         })).sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));
  //       } else {
  //         console.error("Invalid response format for subcategories");
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //     }
  //   );
  // }
  fetchAllCategories(): void {
    this.eventservice.geteventCategories().subscribe(
      (res) => {
        if (res && Array.isArray(res)) {
          const categories = res.map((category: any) => ({
            label: category.name,  
            value: category._id    
          }));
          

          this.eventservice.eventsubCategories().subscribe(
            (subRes) => {

              if (subRes && Array.isArray(subRes)) {
                const subCategories = subRes.map((subcategory: any) => {
               
                  this.subcategoryToCategoryMap[subcategory._id] = subcategory.category;
                  return {
                    label: `${subcategory.name}`,   
                    value: subcategory._id,        
                    isSubcategory: true             
                  };
                });
                
        
                this.combinedCategoryOptions = [...categories, ...subCategories];
              } else {
                console.error("Invalid response format for subcategories");
              }
            },
            (err) => {
              console.error(err);
            }
          );
        } else {
          console.error("Invalid response format for categories");
        }
      },
      (err) => {
        console.error(err);
      }
    );
  }
  subCategoryOptions: any[] = [];

  fetchAllSubCategories(): void {
    this.eventservice.eventsubCategories().subscribe(
      (res) => {

        if (res && Array.isArray(res)) {
          this.subCategoryOptions = res.map((subcategory: any) => ({
            label: subcategory.name,  
            value: subcategory._id    
          }));
        } else {
          console.error("Invalid response format for subcategories");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }


  onCategoryChange(event: any): void {
    const selectedCategory = event.target.value;
    const selectedCategoryOption = this.combinedCategoryOptions.find(option => option.value === selectedCategory);
    
    if (selectedCategoryOption?.isSubcategory) {
      this.organizationForm.get('category')?.clearValidators();
      this.organizationForm.get('category')?.updateValueAndValidity();
      this.organizationForm.get('sub_category')?.setValue(selectedCategory);
    } else {
      this.organizationForm.get('sub_category')?.setValue('');
      this.organizationForm.get('category')?.clearValidators();
      this.organizationForm.get('category')?.updateValueAndValidity();
    }
  
    console.log('Selected Category Option:', selectedCategoryOption);
  }
  
  selectedCategoryLabel: string | undefined;


  handleBannerFileChange(info: NzUploadChangeParam): void {
    this.handleUpload(info, 'event_images');
  }

  handleBrochureFileChange(info: NzUploadChangeParam): void {
    this.handleUpload(info, 'brochure');
  }

  handleBannerFileRemove(file: NzUploadFile): boolean {
    this.bannerFileList = this.bannerFileList.filter(f => f.uid !== file.uid);
    this.updateFormControl('event_images', this.bannerFileList);
    return true;
  }

  handleBrochureFileRemove(file: NzUploadFile): boolean {
    this.brochureFileList = [];
    this.organizationForm.patchValue({ brochure: '' });
    return true;
  }

  handleUpload(info: NzUploadChangeParam, formControlName: string): void {
    const fileList = [...info.fileList];

    fileList.forEach((file: NzUploadFile) => {
      this.getBase64(file.originFileObj!, (base64String: string) => {
        file['base64'] = base64String;

        if (formControlName === 'event_images') {
          this.bannerFileList = fileList;
          this.updateFormControl('event_images', this.bannerFileList);
        } else if (formControlName === 'brochure') {
          this.brochureFileList = fileList;
          this.organizationForm.patchValue({ brochure: base64String });
        }
      });
    });
  }

  updateFormControl(controlName: string, fileList: NzUploadFile[]): void {
    const base64Images = fileList.map(file => file['base64']);
    this.organizationForm.patchValue({ [controlName]: base64Images });
  }

  getBase64(file: File, callback: (base64String: string) => void): void {
    const reader = new FileReader();
    reader.onload = () => {
      let base64String = reader.result as string;
      base64String = base64String.split(',')[1]; 
      callback(base64String);
    };
    reader.readAsDataURL(file);
  }


  brochureFileList: NzUploadFile[] = [];
  eventimages: NzUploadFile[] = [];  



  fetchAllorganizations(): void {
    this.organizationService.getallorganaztions().subscribe(
      (res) => {
        if (res && res.results && Array.isArray(res.results)) {
          this.organizationsyOptions = res.results.map((organization: any) => ({
            label: organization.organization_name,
            value: organization._id
          })).sort((a: { label: string }, b: { label: string }) => a.label.localeCompare(b.label));
        } else {
          console.error("Invalid response format for organizations");
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  





}
