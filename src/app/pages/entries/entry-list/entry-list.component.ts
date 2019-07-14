import { Component, OnInit } from '@angular/core';
import * as faker from 'faker';
import { Observable, Subscription } from 'rxjs';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { CategoryService } from '../../categories/shared/category.service';
import { Category } from '../../categories/shared/category.model';
import { BaseResourceListComponent } from 'src/app/shared/components/base-resource-list/base-resource-list.component';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})

export class EntryListComponent extends BaseResourceListComponent<Entry> implements OnInit {

  entry: Entry[] = [];

  category$: Observable<Category[]>;
  category: Category = null;

  subscription: Subscription;

  pago: boolean[] = [true, false];
  cat: string[] = ['expense', 'revenue'];

  constructor(private entryService: EntryService, private cs: CategoryService) {
      super(entryService);
      
   }

  ngOnInit() {
    this.category$ = this.cs.getAll();    
    super.ngOnInit();
    
    this.resources$.subscribe( 
      (res) => {
        this.entry = [];
        res.forEach(element => {
          const ent = Entry.fromData(element);          
          this.entry.push(ent);
        })      
      }
    )
  }

  addOne(c: Category){
    let e;    
    if(c.id)
      e = {
        name: faker.finance.accountName(),
        description: faker.finance.transactionType(),
        type: this.random_item(this.cat),
        amount: faker.finance.amount(),
        date: new Date().toLocaleDateString(),
        paid: this.random_item(this.pago),
        category: c,
        categoriId: c.id,
      }

    this.entryService.add(e);
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  generate(){
    this.subscription = this.category$
      .subscribe( 
        obj => {
          this.addOne(this.random_item(obj))
        },
        (error) => { "Error: " + error});
  }

  deleteResource(e: Entry){

    if(super.deleteResource(e)){
      const index = this.entry.indexOf( e );
      this.entry.splice(index, 1);
      return true
    }    
    
  }

  private random_item(items){
    return items[Math.floor(Math.random()*items.length)];
  }

}