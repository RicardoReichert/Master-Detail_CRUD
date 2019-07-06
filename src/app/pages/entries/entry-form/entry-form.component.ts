import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { throwError, Observable, Subscription } from 'rxjs';
import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  
  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  entry: Entry = new Entry();
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
    private categoryService: CategoryService,
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();

    this.category$ = this.categoryService.getAll();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();
  }  

  onSubmit(){
    let e:Entry = this.entryForm.value;
    
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

      this.router.navigateByUrl("/entries/new");
    }
    
    this.entryForm.reset();
  }

  // PRIVATE METHODS

  private updateEntry(e: Entry, c: Category){
    e.category = c;  
    this.entryService.update(e);
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  private addEntry(e: Entry, c: Category){
    e.category = c;  
    this.entryService.add(e);
    this.subscription.unsubscribe();
    this.subscription = null;
  }

  setPageTitle() {
    if(this.currentAction == "new")
      this.pageTitle = "Cadastro de Novo Lançamento";
    else{
      const entryName = this.entry.name || "";
      this.pageTitle = "Editando Lançamento: " + entryName;
    }
  }

  private setCurrentAction() {
    if(this.route.snapshot.url[0].path == "new"){
      this.currentAction = "new";
    }else{
      this.currentAction = "edit";
    }
  }

  private loadEntry() {
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(params.get('id')))
      )
      .subscribe(
        (entry) => {
          this.entry = Entry.fromData(entry.data());
          console.log(this.entry);          
          this.entryForm.setValue(this.entry);          
        },
        (err) => {
          this.handleError(err);
        }
      )
    }
  }
  
  private buildEntryForm() {
    this.entryForm = this.fb.group({
      name: ["", [Validators.required]],
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

  private handleError(error: any[]): Observable<any>{    
    console.log("ERRO NA REQUISIÇÂO => ",  error);
    return throwError(error);    
  }

}
