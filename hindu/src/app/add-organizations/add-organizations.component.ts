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
import { MemberProfileComponent } from '../member-profile/member-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { NgxSpinnerService,NgxSpinnerModule  } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Required for animations



@Component({
  selector: 'app-add-organizations',
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
    NzUploadModule,
  ],
    templateUrl: './add-organizations.component.html',
  styleUrl: './add-organizations.component.css'
})
export class AddOrganizationsComponent {

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
  combinedCategoryOptions: any[] = [];
  subcategoryToCategoryMap: { [key: string]: string } = {}; 
  subCategoryOptions: any[] = [];
  organization: any; 
  displayName = 'submission';
  // formGroup:any;

  constructor(private fb: FormBuilder,
    private organizationService: OrganizationsService,
    private authService: AuthenticationService,
    private cdr: ChangeDetectorRef,
    private spinner: NgxSpinnerService,

    private formBuilder: FormBuilder,
    private router:Router,
    private dialog:MatDialog,
    private notificationHelper: NotificationHelper,
  ) {

    this.organizationForm = this.fb.group({  

      object_id:['', [Validators.required]],

      category_id: ['', [Validators.required]],
      sub_category_id: [''],
      continent: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      organization_name: ['', Validators.required],
      est_by: ['', Validators.required],
      chairman: ['', Validators.required],
      est_date: ['', Validators.required],
      reg_id: ['', Validators.required],
      location: ['', Validators.required],
      web_url: ['', Validators.required],
      org_detail: ['', Validators.required],
      mission: ['', Validators.required],
      org_images: ['', Validators.required],
      org_logo: ['', Validators.required],
      status: ['PENDING'],
      organization_members: ['', Validators.required],
      geo_site: ['DISTRICT'],
      user:localStorage.getItem('user')


     });
   }

  ngOnInit() {
    this.fetchAllCategories();



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

  loading: boolean = false;
  submittedOrganization: any; 

  onSubmit() {
  
    if (this.organizationForm.valid) {
      this.loading = true; // Start loader

      const formValue = { ...this.organizationForm.value };
      const selectedCategory = formValue.category_id;
      const selectedCategoryOption = this.combinedCategoryOptions.find(option => option.value === selectedCategory);
  
      if (selectedCategoryOption?.isSubcategory) {
        formValue.sub_category_id = selectedCategory;
        formValue.category_id = this.subcategoryToCategoryMap[selectedCategory];
      } else {
        formValue.sub_category_id = '';
      }
  
      this.organizationService.addorganization(formValue)
        .subscribe(
          response => {
            console.log('Organization added successfully:', response);
            this.notificationHelper.showSuccessNotification('Add Organization Success', '');

            this.resetForm();

            // this.router.navigate(['organizationdetail'], { state: { data: response } });            
              this.formDisabled = false;
              this.loading = false;
              // this.router.navigate(['organization-detail'], { state: { data: response } });
              // const organizationId = response.object_id || response.organizationId; 
          
              // this.router.navigate(["getbyorganization", organizationId]);

          },
          error => {
            console.error('Error adding organization:', error);
            this.loading = false;
  
            if (error.status === 400 && error.error.message === "Cannot create organization. Membership details are required. Update your profile and become a member.") {
              this.notificationHelper.showErrorNotification('Organization not added. Membership details are required.');
              this.openMemberDialog(); 
            } else {
              this.notificationHelper.showErrorNotification('Organization not added');
            }
          }
        );
    } else {
      this.organizationForm.markAllAsTouched();
      console.log('Form is invalid.');
    }
  }
  
  openMemberDialog(): void {
    console.log('Opening member form dialog');
    const dialogRef = this.dialog.open(MemberProfileComponent, {
      data: { displayName: 'signup' },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('Member form dialog closed');
      if (result === 'success') {  
        this.onSubmit();  
      }
    });
  }
  


  resetForm() {
    this.organizationForm.reset();
  
    this.orgImageFileList = [];
    this.orgLogoFileList = [];
    this.govtIdProofFileList = [];
  
    this.organizationForm.patchValue({
      org_images: null,
      org_logo: null,
      govt_id_proof: null
    });
  }




  fetchAllCategories(): void {
    this.organizationService.getCategories().subscribe(
      (res) => {
        if (res && Array.isArray(res)) {
          const categories = res.map((category: any) => ({
            label: category.name,  
            value: category._id    
          }));
          

          this.organizationService.getsubCategories().subscribe(
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
  
  fetchAllSubCategories(): void {
    this.organizationService.getsubCategories().subscribe(
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
  


  orgImageFileList: NzUploadFile[] = [];
  orgLogoFileList: NzUploadFile[] = [];
  govtIdProofFileList: NzUploadFile[] = [];


handleOrgImageChange(info: NzUploadChangeParam): void {
  this.handleUpload(info, 'org_images');
}

handleOrgLogoChange(info: NzUploadChangeParam): void {
  this.handleUpload(info, 'org_logo');
}

handleGovtIdProofChange(info: NzUploadChangeParam): void {
  this.handleUpload(info, 'govt_id_proof');
}

handleUpload(info: NzUploadChangeParam, formControlName: string): void {
  const fileList = [...info.fileList];

  fileList.forEach((file: NzUploadFile) => {
    this.getBase64(file.originFileObj!, (base64String: string) => {
      file['base64'] = base64String;
      this.organizationForm.patchValue({ [formControlName]: base64String });
    });
  });

  if (formControlName === 'org_images') {
    this.orgImageFileList = fileList;
  } else if (formControlName === 'org_logo') {
    this.orgLogoFileList = fileList;
  } else if (formControlName === 'govt_id_proof') {
    this.govtIdProofFileList = fileList;
  }

  console.log('Form Values:', this.organizationForm.value);
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


onCategoryChange(event: any): void {
  const selectedCategory = event.target.value;
  const selectedCategoryOption = this.combinedCategoryOptions.find(option => option.value === selectedCategory);
  
  if (selectedCategoryOption?.isSubcategory) {
    this.organizationForm.get('category_id')?.clearValidators();
    this.organizationForm.get('category_id')?.updateValueAndValidity();
    this.organizationForm.get('sub_category_id')?.setValue(selectedCategory);
  } else {
    this.organizationForm.get('sub_category_id')?.setValue('');
    this.organizationForm.get('category_id')?.clearValidators();
    this.organizationForm.get('category_id')?.updateValueAndValidity();
  }

  console.log('Selected Category Option:', selectedCategoryOption);
}

selectedCategoryLabel: string | undefined;

}

