import { Injectable } from '@angular/core';

import { Observable, from } from "rxjs";
import { Category } from './category.model';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoryCollection: AngularFirestoreCollection<Category> = this.afs.collection('Categories');

  constructor(
    private afs : AngularFirestore
  ) { }

  getALLCategory(): Observable<Category[]>{
    return this.categoryCollection.valueChanges();
  }

  getByIdCategory(id: string){
    return this.categoryCollection.doc(id).get()
  }

  addCategory(c: Category){
    c.id = this.afs.createId();
    return this.categoryCollection.doc(c.id).set(c);
  }

  deleteCategory(c: Category){
    return this.categoryCollection.doc(c.id).delete();
  }

  updateCategory(c: Category){
    return this.categoryCollection.doc(c.id).set(c);
  }

}

/*
  getAll(): Observable<Category[]>{
    return this.http.get<Category[]>(this.apiPath)
      .pipe(
        tap(p=>console.log(p)),
        catchError(this.handleError),
        map(this.jasonDataToCategories)
      )
  }

  getById(id:number):Observable<Category>{
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url)
      .pipe( 
        catchError(this.handleError),
        map(this.jasonDataToCategory)
      )
  }

  create(category: Category): Observable<Category>{
    return this.http.post(this.apiPath, category)
      .pipe( 
        catchError(this.handleError),
        map(this.jasonDataToCategory)
      )
  }

  update(category: Category): Observable<Category>{
    const url = `${this.apiPath}/${category.id}`;
    return this.http.put(url, category)
      .pipe( 
        catchError(this.handleError),
        map( () => category )
      )
  }

  delete(id: number): Observable<any>{
    const url = `${this.apiPath}/${id}`;
    return this.http.get(url)
      .pipe( 
        catchError(this.handleError),
        map( () => null)
      )
  }

  // PRIVATE METHODS

  private jasonDataToCategories(jasonData: any[]): Category[]{
    const categories: Category[] = [];
    jasonData.forEach(element => categories.push(element as Category));
    return categories
  }

  private jasonDataToCategory(jasonData: any): Category{
    return jasonData as Category;
  }

  private handleError(error: any[]): Observable<any>{    
    console.log("ERRO NA REQUISIÇÂO => ",  error);
    return throwError(error);    
  }
  */