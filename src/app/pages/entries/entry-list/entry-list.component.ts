import { Component, OnInit } from '@angular/core';
import * as faker from 'faker';
import { Observable, Subscription } from 'rxjs';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { CategoryService } from '../../categories/shared/category.service';
import { switchMap, map, delay } from 'rxjs/operators';
import { Category } from '../../categories/shared/category.model';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entry$: Observable<Entry[]>;
  entry: Entry[] = [];
  category$: Observable<Category[]>;
  category: Category = null;
  subscription: Subscription;
  pago: boolean[];
  cat: string[];
  

  constructor(private entryService: EntryService, private cs: CategoryService) {
      this.pago = [true, false];
      this.cat = ['expense', 'revenue'];
   }

  ngOnInit() {
    this.category$ = this.cs.getAll(); 
    this.entry$ = this.entryService.getAll();
    this.entry$.subscribe( 
      (entry) => {
        this.entry = [];
        entry.forEach(element => {
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

  delete(e: Entry){
    const mustDelete = confirm('Deseja realmente excluir este item?');

    if(mustDelete){
      const index = this.entry.indexOf( e );
      this.entry.splice(index, 1);
      
      this.entryService.delete(e)
      .then(
        ()=>{
          console.log("Product removed.");
        }
      )
      .catch(
        ()=>{
          console.error("Error on remove the product.");
        }
      )
    }
    
  }

  private random_item(items){
    return items[Math.floor(Math.random()*items.length)];
  }

}