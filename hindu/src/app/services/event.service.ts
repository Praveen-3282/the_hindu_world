import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private httpClient: HttpClient) { }




  geteventCategories():Observable<any>{
    return this.httpClient.get(URL+"eventcategory")   
  }


  // getevents(categoryId: string,locationId: string): Observable<any> {
  //   return this.httpClient.get(URL+"locationByEvents/",{
  //         params: {
  //           category: categoryId,
  //           input_value: locationId,
            
  //         }
  //       });
  //     }



  getevents(categoryId: string, locationId: string, page: number = 1): Observable<any> {
    return this.httpClient.get(`${URL}locationByEvents`, {
      params: {
        category: categoryId,
        input_value: locationId,
        page: page.toString()
      }
    });
  }

      getallevents():Observable<any>{
        return this.httpClient.get(URL+"events")
      }




      eventnCategorydata(id: string):Observable<any>{
        return this.httpClient.get(URL+'eventcategory/'+id)
      }



      geteventsById(_id: string):Observable<any>{
        return this.httpClient.get(URL+'events/'+_id)
 
      }

      addevent(event: any): Observable<any> {
        return this.httpClient.post(URL+"events", event);
      }

      eventsubCategories():Observable<any>{
        return this.httpClient.get(URL+"eventsubcategory")   
      }

      
      geteventById(_id: string):Observable<any>{
        return this.httpClient.get(URL+'eventsubcategory/'+_id)
 
      }
}
