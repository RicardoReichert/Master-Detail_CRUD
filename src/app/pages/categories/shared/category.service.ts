import { Injectable } from '@angular/core';

import { Observable, from, throwError } from "rxjs";
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