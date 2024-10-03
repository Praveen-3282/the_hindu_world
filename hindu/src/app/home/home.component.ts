import { Component } from '@angular/core';
import { WorldMapComponent } from '../world-map/world-map.component';
import { MapsModule } from '@syncfusion/ej2-angular-maps';
import { HomepageService } from '../services/homepage.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
// import { AuthService } from '../services/auth.service';
import { AuthenticationService } from '../services/authentication.service';
import { UserService } from '../services/user.service';
import { MemberProfileComponent } from '../member-profile/member-profile.component';
import { MatDialog } from '@angular/material/dialog';
import { TrainerUpdateComponent } from '../trainer-update/trainer-update.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [WorldMapComponent, MapsModule,CommonModule,MatIconModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent { 

  organizations: any[] = [];
  training: any[] = [];
  events: any[] = [];

  constructor(private homepageservice:HomepageService,private router:Router,private authservice:AuthenticationService,private userservice:UserService, private dialog:MatDialog,) {}

  ngOnInit(): void {
    this.fetchhome();
  }



  fetchhome(): void {
    this.homepageservice.homepage().subscribe(
      (response: any) => {
        this.organizations = response.organizations;
        this.events = response.events;
        this.training = response.trainings;
      },
      (error) => {
        console.error('Error fetching organizations:', error);
      }
    );
  }


  shareNews() {

    const shareUrl = "http://gramadevata.com/home";
    console.log('Share URL:', shareUrl);
    if (navigator.share) {
      navigator.share({

        url: shareUrl
      }).catch((error) => console.log('Error sharing:', error));
    } else {
      console.log('Share API not supported');
    }
  }

  // navigateTo(route: string): void {
  //   this.router.navigate([route]);
  // }

  navigateTo(route: string): void {
  
    const isMemberIn = localStorage.getItem("is_member") === "true"; 
    let userId = this.authservice.getCurrentUser();
      if (userId == undefined || userId == null) {
        this.authservice.showLoginModal()
        return;
      }
    
    if (isMemberIn) {
      this.router.navigate([route]);
    } else {
      
      this.userservice.showMemberModal();
    }
  }
  
  
  
  
  openmemberDialog(): void {
    console.log('sssssssssss');
    const dialogRef = this.dialog.open(MemberProfileComponent, {
      data: { displayName: 'signup' },
      autoFocus: false,
      backdropClass: 'dialog-backdrop',
    });
  
    dialogRef.afterClosed().subscribe(() => {
    });
  }


  navigateToOrganizations(){
        this.router.navigate(['Organizations']);
  }
  navigateToevent(){
    this.router.navigate(['event']);
  }
  navigateToTraining(){
    this.router.navigate(['Training']);

  }

}