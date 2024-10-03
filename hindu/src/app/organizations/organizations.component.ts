import { Component , HostListener, OnDestroy, OnInit} from '@angular/core';
import { OrganizationsService } from '../services/organizations.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule,Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { NzTreeNode, NzTreeNodeOptions } from 'ng-zorro-antd/tree';
import { Subscription, interval, Subject } from 'rxjs';
import { switchMap, takeUntil, finalize } from 'rxjs/operators'; 




@Component({
  selector: 'app-organizations',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NzSelectModule,NzFormModule,NzTreeModule],
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.css'
})
export class OrganizationsComponent {

  categories: any[] = [];
  continents: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  districts: any[] = [];
  organizations: any[] = [];

  selectedContinent: string = '';
  selectedCountry: string = '';
  selectedState: string = '';
  selectedDistrict: string = '';
  countrydata: any;
  districtdata:any;
  nodes: NzTreeNodeOptions[] = [];
  searchValue: string = '';

  CountryOptions: any[]=[];
  StateOptions:any[]=[];
  DistrictOptions:any[]=[];
  ContinentOptions:any[]=[];
  validatorForm!:FormGroup;
  selectedLocationId: any;
  selectedCategoryId:any;
  selectedsubCategoryId:any
  // globaltemples: any[] = [];
  orginazationsCategorydata:any
  currentPage: number = 1;
  isLoading: boolean = true;
  isLoadingNextPage: boolean = false;
  subscription: Subscription = new Subscription();
  destroy$: Subject<void> = new Subject<void>();


  constructor(private organizationService: OrganizationsService,private route:ActivatedRoute, private fb:FormBuilder,   private router:Router,) {}

  // ngOnInit(): void {
  //   this.selectedCategoryId = this.route.snapshot.paramMap.get('id');
  //   if(this.selectedCategoryId){

  //     this.loadOrganizations();
  //   }

  //       this.loadLocations();




  //   this.organizationService.getCategories().subscribe(
  //     (categories: any[]) => {
  //       this.nodes = this.createNodeTree(categories);
  //       this.nodes.push({ key: '', title: 'All Organizations', value: '' });

  //       this.nodes.sort((a, b) => a.title.localeCompare(b.title));
  //     },
  //     (err: any) => console.error('Error loading categories:', err)
  //   );
  // }



  // onCategoryClick(event: NzFormatEmitEvent) {
  //   this.selectedCategoryId = event.node?.origin?.key; 
  //   console.log(this.selectedCategoryId,"1111111111111")
  //   this.router.navigate(["organizations", this.selectedCategoryId])
  //   if (this.selectedCategoryId ==='AllTemples') {
  //     console.log(this.selectedCategoryId,"poiuy")
  //     this.selectedCategoryId = '';
  //   }
    
  //   this.applyFilters();
    
  // }







  // nzEvent(event: NzFormatEmitEvent): void {
  //   const node = event.node!;

  //   if (event.eventName === 'click' || event.eventName === 'expand') {
  //     if (!node.isExpanded && node.children.length === 0 && !node.isLeaf) {
  //       this.loadSubcategories(node);
  //     }
  //   }
  // }

  // loadSubcategories(node: NzTreeNode): void {
  //   this.organizationService.getsubCategories().subscribe(
  //     (subcategories: any[]) => {
  //       const children = subcategories.filter(sub => sub.category_id === node.key)
  //         .map(sub => ({
  //           title: sub.name,
  //           key: sub._id,
  //           isLeaf: true 
  //         }));

  //       node.addChildren(children);
  //       node.isExpanded = true;
  //     },
  //     (err: any) => console.error('Error loading subcategories:', err)
  //   );
  // }

  // createNodeTree(data: any[]): NzTreeNodeOptions[] {
  //   return data.map(item => ({
  //     title: item.name,
  //     key: item._id,
  //     isLeaf: false 
  //   }));
  // }


  ngOnInit(): void {
    this.selectedCategoryId = this.route.snapshot.paramMap.get('id');
    if (this.selectedCategoryId) {
      this.loadOrganizations();
    }
    
    this.loadLocations();
  
    this.organizationService.getCategories().subscribe(
      (categories: any[]) => {
        this.nodes = this.createNodeTree(categories);
        this.nodes.push({ key: '', title: 'All Organizations', value: '' });
  
        this.nodes.sort((a, b) => a.title.localeCompare(b.title));
      },
      (err: any) => console.error('Error loading categories:', err)
    );
  }
  
  onCategoryClick(event: NzFormatEmitEvent) {
    const node = event.node!;
    this.selectedCategoryId = node.origin.key;
  
    console.log(this.selectedCategoryId, "1111111111111");
    this.router.navigate(["organizations", this.selectedCategoryId]);
  
    if (this.selectedCategoryId === 'AllTemples') {
      console.log(this.selectedCategoryId, "poiuy");
      this.selectedCategoryId = '';
    }
  
    if (!node.isExpanded && node.children.length === 0 && !node.isLeaf) {
      this.loadSubcategories(node);
    } else {
      node.isExpanded = !node.isExpanded; 
    }
  
    this.applyFilters();
  }
  
  loadSubcategories(node: NzTreeNode): void {
    this.organizationService.getsubCategories().subscribe(
      (subcategories: any[]) => {
        const children = subcategories.filter(sub => sub.category_id === node.key)
          .map(sub => ({
            title: sub.name,
            key: sub._id,
            isLeaf: true 
          }));
  
        node.addChildren(children);
        node.isExpanded = true;
      },
      (err: any) => console.error('Error loading subcategories:', err)
    );
  }
  
  createNodeTree(data: any[]): NzTreeNodeOptions[] {
    return data.map(item => ({
      title: item.name,
      key: item._id,
      isLeaf: false 
    }));
  }
  


  cleardata(){
    this.selectedCategoryId = []
  }

  onReset(): void {
    this.validatorForm.reset();
    this.selectedLocationId = [];
    this.applyFilters();
  }

  applyFilters() {
    this.currentPage = 1;
    this.organizations = []; 
    this.loadOrganizations();
    
  }


  loadOrganizations() {
    
    if (this.selectedLocationId && this.selectedCategoryId ) {
        this.organizationService.getOrganizations( this.selectedCategoryId,this.selectedLocationId,this.currentPage).subscribe(
            (data: any) => {
                this.organizations = data.results; 
                this.organizations.sort((a: any, b: any) => {
                  return a.organization_name.toLowerCase().localeCompare(b.organization_name.toLowerCase());
                });
                console.log(this.organizations, "Filtered orginazations with Category and Location123");
            },
            (error) => {
                console.error('Error fetching filtered orginazations:', error);
            }
        );
    }

    else if (this.selectedCategoryId) {
      console.log(this.selectedCategoryId,"aqwefrhj")
      this.organizationService.getOrganizations(this.selectedCategoryId,'',this.currentPage).subscribe(
          (data: any) => {
              this.organizations = data.results;  
              this.organizations.sort((a: any, b: any) => {
                return a.organization_name.toLowerCase().localeCompare(b.organization_name.toLowerCase());
              });
              console.log(this.organizations, "Filtered orginazations with Category987 ");
          },
          (error) => {
              console.error('Error fetching filtered orginazations:', error);
          }
      );
  }
     else if (this.selectedLocationId) {
        this.organizationService.getOrganizations('',this.selectedLocationId,this.currentPage).subscribe(
            (data: any) => {
                this.organizations = data.results;  
                this.organizations.sort((a: any, b: any) => {
                  return a.organization_name.toLowerCase().localeCompare(b.organization_name.toLowerCase());
                });
                console.log(this.organizations, "Filtered orginazations with Category987 ");
            },
            (error) => {
                console.error('Error fetching filtered orginazations:', error);
            }
        );
    } else {
        this.organizationService.getallorganaztions(this.currentPage).subscribe(
            (data: any) => {
                this.organizations = data.results; 
                this.organizations.sort((a: any, b: any) => {
                  return a.organization_name.toLowerCase().localeCompare(b.organization_name.toLowerCase());
                }); 
                
                this.currentPage++;
                console.log(this.organizations, "Filtered orginazations without Category or Location");
            },
            (error) => {
                console.error('Error fetching filtered orginazations:', error);
            }
        );

        
    }

    this.organizationService.orginazationCategorydata(this.selectedCategoryId).subscribe(
      data => {
        this.orginazationsCategorydata = data;
      },

    );

    this.organizationService.orginazationsubCategorydata(this.selectedCategoryId).subscribe(
      data => {
        this.orginazationsCategorydata = data;
      },

    );
    
}



  loadLocations(): void {
    this.validatorForm = this.fb.group({
      continent: ['', [Validators.required]],
      country: ['', [Validators.required]],
      state: ['', [Validators.required]],
      district: ['', Validators.required],
      mandal: ['', Validators.required],
      village: ['', Validators.required]
    });

    this.organizationService.getContinents().subscribe(
      (res) => {
        if (res  && Array.isArray(res)) {
          this.ContinentOptions = res.map((continent: any) => ({
            label: continent.name,
            value: continent._id
          }))
          .sort((a, b) => a.label.localeCompare(b.label));
          this.applyFilters()

        } else {
          console.error("Response is not in expected format", res);
        }
      },
      (err) => {
        console.error(err);
      }
    );



    this.validatorForm.get('continent')?.valueChanges.subscribe((continentID) => {
      console.log(continentID, "wdefrgh");
      if (continentID) {
        this.selectedLocationId = continentID; 
        this.applyFilters()
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
        this.resetStates();
      }
    });
    

    this.validatorForm.get('country')?.valueChanges.subscribe((countryID) => {
      if (countryID) {
        this.selectedLocationId = countryID; 
        this.applyFilters()
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
        this.resetStates();
      }
    });
    

    this.validatorForm.get('state')?.valueChanges.subscribe((stateID) => {
      if (stateID) {
        this.selectedLocationId = stateID; 
        this.applyFilters()
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
        this.resetDistricts();
      }
    });

    this.validatorForm.get('district')?.valueChanges.subscribe(districtID => {
      if (districtID) {
        this.selectedLocationId = districtID; 
        this.applyFilters()
        console.log('district ID selected:', this.selectedLocationId);
      } else {
        this.resetDistricts();
      }
    });
    
  }

  resetStates() {
    this.StateOptions = [];
    this.validatorForm.get('state')?.reset();
    this.resetDistricts();
  }

  resetDistricts() {
    this.DistrictOptions = [];
    this.validatorForm.get('district')?.reset();
  }





  navigateorganizationDetail(_id:string):void{
    this.router.navigate(["getbyorganization",_id])
  }

  
}
