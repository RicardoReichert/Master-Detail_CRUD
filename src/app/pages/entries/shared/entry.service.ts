import { Injectable } from '@angular/core';

import { Observable } from "rxjs";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Entry } from './entry.model';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private entryCollection: AngularFirestoreCollection<Entry> = this.afs.collection('Entries');

  constructor(
    private afs : AngularFirestore
  ) { }

  getALLEntry(): Observable<Entry[]>{
    return this.entryCollection.valueChanges();
  }

  getByIdEntry(id: string){
    return this.entryCollection.doc(id).get()
  }

  addEntry(e: Entry){
    e.id = this.afs.createId();
    return this.entryCollection.doc(e.id).set(e);
  }

  deleteEntry(e: Entry){
    return this.entryCollection.doc(e.id).delete();
  }

  updateEntry(e: Entry){
    return this.entryCollection.doc(e.id).set(e);
  }

}