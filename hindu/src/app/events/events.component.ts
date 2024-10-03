import { Component } from '@angular/core';
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
import { EventService } from '../services/event.service';


@Component({
  selector: 'app-events',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule,NzSelectModule,NzFormModule,NzTreeModule],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {




  categories: any[] = [];
  continents: any[] = [];
  countries: any[] = [];
  states: any[] = [];
  districts: any[] = [];
  events: any[] = [];
  pastOrganizations: any[] = [];

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
  selectedCategory:any;
  currentPage: number = 1;

  constructor(private organizationService: OrganizationsService,private route:ActivatedRoute, private fb:FormBuilder,   private router:Router,private eventservice:EventService) {}

  // ngOnInit(): void {
  //   this.selectedLocationId = this.route.snapshot.paramMap.get('id');
  //   // this.loadCategories();
  //   this.loadEvents();
  //       this.loadLocations();
  //       if (this.selectedCategory) {
  //         this.applyFilters();
         
  //       }


  //   this.eventservice.geteventCategories().subscribe(
  //     (categories: any[]) => {
  //       this.nodes = this.createNodeTree(categories);
  //       this.nodes.push({ key: '', title: 'All Events', value: '' });

  //       this.nodes.sort((a, b) => a.title.localeCompare(b.title));
  //     },
  //     (err: any) => console.error('Error loading categories:', err)
  //   );
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
  //   this.eventservice.eventsubCategories().subscribe(
  //     (subcategories: any[]) => {
  //       const children = subcategories.filter(sub => sub.category === node.key)
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

  

  // onCategoryClick(event: NzFormatEmitEvent) {
  //   this.selectedCategory = event.node?.origin?.key; 
  //   console.log(this.selectedCategory, "Selected Category ID");
  //   this.router.navigate(["event", this.selectedCategory]); 

  //   if (this.selectedCategory ==='AllEvents') {
  //     console.log(this.selectedCategory,"poiuy")
  //     this.selectedCategory = '';
  //   }
  //   this.applyFilters();

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
  ngOnInit(): void {
    this.selectedLocationId = this.route.snapshot.paramMap.get('id');
    // this.loadCategories();
    this.loadEvents();
    this.loadLocations();
    
    if (this.selectedCategory) {
      this.applyFilters();
    }
  
    this.eventservice.geteventCategories().subscribe(
      (categories: any[]) => {
        this.nodes = this.createNodeTree(categories);
        this.nodes.push({ key: '', title: 'All Events', value: '' });
  
        this.nodes.sort((a, b) => a.title.localeCompare(b.title));
      },
      (err: any) => console.error('Error loading categories:', err)
    );
  }
  
  onCategoryClick(event: NzFormatEmitEvent) {
    const node = event.node!;
    this.selectedCategory = node.origin.key; 
    console.log(this.selectedCategory, "Selected Category ID");
  
    this.router.navigate(["event", this.selectedCategory]); 
  
    if (this.selectedCategory === 'AllEvents') {
      console.log(this.selectedCategory, "poiuy");
      this.selectedCategory = '';
    }
  
    // Load subcategories on click
    if (!node.isExpanded && node.children.length === 0 && !node.isLeaf) {
      this.loadSubcategories(node);
    } else {
      node.isExpanded = !node.isExpanded; // Toggle node expansion
    }
  
    this.applyFilters();
  }
  
  loadSubcategories(node: NzTreeNode): void {
    this.eventservice.eventsubCategories().subscribe(
      (subcategories: any[]) => {
        const children = subcategories.filter(sub => sub.category === node.key)
          .map(sub => ({
            title: sub.name,
            key: sub._id,
            isLeaf: true 
          }));
  
        node.addChildren(children);
        node.isExpanded = true; // Automatically expand after loading children
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
    this.selectedLocationId = []
    this.applyFilters();
  }

  onReset(): void {
    this.validatorForm.reset();
    this.selectedLocationId = [];
    this.applyFilters();
    // this.loadEvents();
  }

  applyFilters() {
    this.currentPage = 1;
    this.events = []; 
    this.loadEvents();
  }



  toggleFilters() {
    this.filtersVisible = !this.filtersVisible;
  }

  filtersVisible: boolean = true;

  // nzEvent(event: NzFormatEmitEvent): void {
  //   const node = event.node!;

  //   if (event.eventName === 'click' || event.eventName === 'expand') {
  //     if (!node.isExpanded && node.children.length === 0 && !node.isLeaf) {
  //       // this.loadSubcategories(node);
  //     }
  //   }
  // }












eventdata: any[] = [];
UpComingeventdata: any[] = [];
Completedeventdata: any[] = [];
eventcategorydata: any;

loadEvents() {
  if (this.selectedCategory && this.selectedLocationId) {
    this.eventservice.getevents(this.selectedCategory, this.selectedLocationId, this.currentPage).subscribe(
      (response) => {
        this.UpComingeventdata = response.event_upcoming;
        this.Completedeventdata = response.event_completed;
        console.log(this.UpComingeventdata, "Upcoming Events with Category and Location");
        console.log(this.Completedeventdata, "Completed Events with Category and Location");
      },
      (error) => {
        console.error('Error fetching events with category and location:', error);
      }
    );
  } else if (this.selectedCategory) {
    this.eventservice.getevents(this.selectedCategory, '', this.currentPage).subscribe(
      (response) => {
        this.UpComingeventdata = response.event_upcoming;
        this.Completedeventdata = response.event_completed;
        console.log(this.UpComingeventdata, "Upcoming Events with Category");
        console.log(this.Completedeventdata, "Completed Events with Category");
      },
      (error) => {
        console.error('Error fetching events with category:', error);
      }
    );
  } else if (this.selectedLocationId) {
    this.eventservice.getevents('', this.selectedLocationId, this.currentPage).subscribe(
      (response) => {
        this.UpComingeventdata = response.event_upcoming;
        this.Completedeventdata = response.event_completed;
        console.log(this.UpComingeventdata, "Upcoming Events with Location");
        console.log(this.Completedeventdata, "Completed Events with Location");
        this.eventcategorydata = null;
      },
      (error) => {
        console.error('Error fetching events with location:', error);
      }
    );
  } else {
    this.eventservice.getallevents().subscribe(
      (response) => {
        this.UpComingeventdata = response.event_upcoming;
        this.Completedeventdata = response.event_completed;
        console.log(this.UpComingeventdata, "All Upcoming Events");
        console.log(this.Completedeventdata, "All Completed Events");
        this.eventcategorydata = null;
      },
      (error) => {
        console.error('Error fetching all events:', error);
      }
    );
  }

  // Fetch event category data for the selected category
  this.eventservice.eventnCategorydata(this.selectedCategory).subscribe(
    data => {
      this.eventcategorydata = data;
      console.log(this.eventcategorydata, "Event Category Data");
    },
    error => {
      console.error('Error fetching event category data:', error);
    }
  );
  this.eventservice.geteventById(this.selectedCategory).subscribe(
    data => {
      this.eventcategorydata = data;
    },

  );
}


loadMore() {
  this.currentPage++;
  this.loadEvents();
}



orginazationCategorydata:any





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



  activeTab: string = 'upcoming'; 

  updateTab(tab: string) {
    this.activeTab = tab;
  }



  navigateorganizationDetail(_id:string):void{
    this.router.navigate(["getbyevents",_id])
  }



}



