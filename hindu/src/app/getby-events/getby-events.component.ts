import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrganizationsService } from '../services/organizations.service';
import { CommonModule } from '@angular/common';
import { TrainingService } from '../services/training.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-getby-events',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './getby-events.component.html',
  styleUrl: './getby-events.component.css'
})
export class GetbyEventsComponent {


  organizationId: any;
  organization: any;

  constructor(private route: ActivatedRoute, private eventService: EventService) {}

  ngOnInit(): void {
    this.organizationId = this.route.snapshot.paramMap.get('id');
    this.gettraining();
  }

  gettraining(): void {
    this.eventService.geteventsById(this.organizationId).subscribe(
      (data: any) => {
        this.organization = data;
        console.log(this.organization, "Organization Details");
      },
      (error) => {
        console.error('Error fetching organization details:', error);
      }
    );
  }


  getVideoUrl(): string {
    if (this.organization && this.organization.video) {
      return `data:video/mp4;base64,${this.organization.video}`;
    }
    return '';
  }

  

}


