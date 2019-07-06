import { Injectable, Injector } from '@angular/core';
import { Entry } from './entry.model';
import { BaseResourceService } from 'src/app/shared/models/base-resource.service';

@Injectable({
  providedIn: 'root'
})
export class EntryService extends BaseResourceService<Entry> {

  constructor( protected injector: Injector ) {
    super('Entries', injector);
  }
  
}