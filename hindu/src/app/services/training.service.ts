import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpParams  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { URL } from '../../constants';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(private httpClient: HttpClient) { }





  getTrainingCategories():Observable<any>{
    return this.httpClient.get(URL+"trainingcategory")   
    
  }


  getTrainings(categoryId: string,locationId: string): Observable<any> {
    return this.httpClient.get(URL+"locationByTraining",{
          params: {
            category: categoryId,
            input_value: locationId,
            
          }
        });
      }



      getalltrainings():Observable<any>{
        return this.httpClient.get(URL+"training")
      }



      trainingCategorydata(_id: string):Observable<any>{
        return this.httpClient.get(URL+'trainingcategory/'+_id)
 
      }

      getTrainingById(_id: string):Observable<any>{
        return this.httpClient.get(URL+'training/'+_id)
 
      }

      addtraining(training: any): Observable<any> {
        return this.httpClient.post(URL+"training", training);
      }


      
      gettrainingsubCategories():Observable<any>{
        return this.httpClient.get(URL+"trainingsubcategory")   
      }


      traininggetById(_id: string):Observable<any>{
        return this.httpClient.get(URL+'trainingsubcategory/'+_id)
 
      }
}
