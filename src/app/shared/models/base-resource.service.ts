import { BaseResourceModel } from './base-resource.model';
import { Observable } from "rxjs";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Injector } from '@angular/core';

export abstract class BaseResourceService<T extends BaseResourceModel> {

    protected resourceCollection: AngularFirestoreCollection<T>;
    protected angularFirestore : AngularFirestore;

    constructor(
        protected collectionName: string,
        protected injector: Injector 
    ){
        this.angularFirestore = injector.get(AngularFirestore);
        this.resourceCollection = this.angularFirestore.collection(collectionName);
    }
    
    getAll(): Observable<T[]>{
        return this.resourceCollection.valueChanges();
    }

    getById(resource: string){
        return this.resourceCollection.doc(resource).get()
    }

    add(resource: T){
        resource.id = this.angularFirestore.createId();
        return this.resourceCollection.doc(resource.id).set(resource);
    }

    delete(resource: T){
        return this.resourceCollection.doc(resource.id).delete();
    }

    update(resource: T){
        return this.resourceCollection.doc(resource.id).set(resource);
    }
}