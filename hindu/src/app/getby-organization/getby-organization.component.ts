import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizationsService } from '../services/organizations.service';
import { CommonModule } from '@angular/common';
import { SharedService } from '../services/shared.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-getby-organization',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './getby-organization.component.html',
  styleUrl: './getby-organization.component.css'
})
export class GetbyOrganizationComponent {

  private subscription: Subscription = new Subscription();


  organizationId: any;
  organization: any;

  constructor(private route: ActivatedRoute, private organizationService: OrganizationsService,private sharedService:SharedService) {}

  ngOnInit(): void {

    this.subscription.add(
      this.sharedService.triggerFetchVillageData$.subscribe(() => {
        this.getOrganizationDetails();
      })
    );
    this.organizationId = this.route.snapshot.paramMap.get('id');
    this.getOrganizationDetails();
  }

  getOrganizationDetails(): void {
    this.organizationService.getOrganizationById(this.organizationId).subscribe(
      (data: any) => {
        this.organization = data;
        console.log(this.organization, "Organization Details");
      },
      (error) => {
        console.error('Error fetching organization details:', error);
      }
    );
  }

}
