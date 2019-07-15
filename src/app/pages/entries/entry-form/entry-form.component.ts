import { Component, OnInit, Injector } from '@angular/core';
import { Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

import { BaseResourceFormComponent } from 'src/app/shared/components/base-resource-form/base-resource-form.component';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent extends BaseResourceFormComponent<Entry> implements OnInit {
  
  category$ : Observable<Category[]>;
  subscription: Subscription;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    normalizeZeros: true,
    radix: ','
  }

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"],
    dayNamesMin: ["Do","Se","Te","Qu","Qu","Se","Sa"],
    monthNames: [ 
      "Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto",
      "Setembro","Outubro","Novembro","Dezembro" ],
    monthNamesShort: [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun","Jul", "Ago", "Set", "Out", "Nov", "Dec" ],
    today: 'Hoje',
    clear: 'Limpar'
};

  constructor(
    protected categoryService: CategoryService,
    protected entryService: EntryService,
    protected injector: Injector
  ) { 
    super(injector, new Entry(), entryService)
  }

  ngOnInit() {
    this.category$ = this.categoryService.getAll();
    super.ngOnInit();
  }
  
  protected buildResourceForm() {
    this.resourceForm = this.fb.group({
      name: ["", [Validators.required, Validators.minLength(6)]],
      description: ["", [Validators.required]],
      id: [null],
      type: ['expense', [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [true, [Validators.required]],
      category: [null],
      categoriId: [null, [Validators.required]],
    })
  }

  protected onSubmit(): void {
    let e:Entry = this.resourceForm.value;
    
    if(!e.id)
      this.subscription = this.categoryService.getById(e.categoriId)
      .subscribe(
        (category) => {
          this.addEntry(e, category.data())
        })
    else{
      this.subscription = this.categoryService.getById(e.categoriId)
        .subscribe(
          (category) => {
            this.updateEntry(e, category.data())
          })
          const baseComponentPath: string = this.route.snapshot.parent.url[0].path;
          // redirect/reload component page
          this.router.navigateByUrl(baseComponentPath, {skipLocationChange: true}).then(
            () => this.router.navigate([baseComponentPath, e.id, "edit"])
          )
        }
    this.resourceForm.reset();
  }

  // PRIVATE METHODS

  protected updateEntry(e: Entry, c: Category){
    e.category = c;  
    this.entryService.update(e);
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  protected addEntry(e: Entry, c: Category){
    e.category = c;  
    this.entryService.add(e);
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  get typesOptions(): Array<any>{
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )    
  }  

  protected createPagetitle(): string{
    return "Cadastro de Novo Lançamento";
  }

  protected editionPagetitle(): string{
    const entryName = this.resource.name || "";
    return "Editando Lançamento: "+ entryName;
  }

}
