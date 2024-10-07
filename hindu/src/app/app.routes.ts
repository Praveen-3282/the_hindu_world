import { Routes } from '@angular/router';
import { WorldMapComponent } from './world-map/world-map.component';
import { HomeComponent } from './home/home.component';
import { OrganizationsComponent } from './organizations/organizations.component';
import { EventsComponent } from './events/events.component';
import { AddOrganizationsComponent } from './add-organizations/add-organizations.component';
import { GetbyOrganizationComponent } from './getby-organization/getby-organization.component';
import { SignupComponent } from './signup/signup.component';
import { VerifyComponent } from './verify/verify.component';
import { MemberProfileComponent } from './member-profile/member-profile.component';
import { ProfileComponent } from './profile/profile.component';
import { TrainingComponent } from './training/training.component';
import { GetbyTrainingComponent } from './getby-training/getby-training.component';
import { AddTrainingComponent } from './add-training/add-training.component';
import { GetbyEventsComponent } from './getby-events/getby-events.component';
import { AddEventComponent } from './add-event/add-event.component';
import { LoggedinguardGuard } from './guards/login.guard';
import { AboutUsComponent } from './about-us/about-us.component';
import { OrganizationdetailComponent } from './organizationdetail/organizationdetail.component';


export const routes: Routes = [
    {path:'worldmap',component:WorldMapComponent},
    {path:'home',component:HomeComponent },  
    {path:'',pathMatch:'full',redirectTo:'home'},
    {path:'Organizations',component:OrganizationsComponent,canActivate: [LoggedinguardGuard], },
    {path:'event',component:EventsComponent,canActivate: [LoggedinguardGuard], },
    {path:'getbyorganization/:id',component:GetbyOrganizationComponent},
    {path:'signup',component:SignupComponent},
    {path:'verify',component:VerifyComponent},
    {path:'profile',component:ProfileComponent},
    {path:'Training',component:TrainingComponent,canActivate: [LoggedinguardGuard], },
    {path:'getbytraining/:id',component:GetbyTrainingComponent},
    {path:'getbyevents/:id',component:GetbyEventsComponent},
    {path:'add-training',component:AddTrainingComponent,canActivate: [LoggedinguardGuard], },
    {path:'addevent',component:AddEventComponent,canActivate: [LoggedinguardGuard], },
    {path:'addorganizations',component:AddOrganizationsComponent,canActivate: [LoggedinguardGuard], },
    {path:'About-us',component:AboutUsComponent},
    {path:'organization-detail',component:OrganizationdetailComponent},

    // ,canActivate: [LoggedinguardGuard],
];
