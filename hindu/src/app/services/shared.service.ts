
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  private triggerFetchprofileData = new Subject<void>();


  triggerFetchprofileData$ = this.triggerFetchprofileData.asObservable(); 



  getUserProfile() { 
    this.triggerFetchprofileData.next();
  }
}
