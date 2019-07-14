import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { throwError, Observable, from } from 'rxjs';
import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../models/base-resource.service';


export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {
  
  currentAction: string;
  resourceForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;

  protected route: ActivatedRoute;
  protected router: Router;
  protected fb: FormBuilder;

  constructor(
    protected injector: Injector,
    public resource: T,
    protected resourceService: BaseResourceService<T>,
  ) 
  {
    this.route = this.injector.get(ActivatedRoute);
    this.router = this.injector.get(Router);
    this.fb = this.injector.get(FormBuilder);
  }

  ngOnInit() {
    this.setCurrentAction();
    this.buildResourceForm();
    this.loadResource();
  }

  ngAfterContentChecked(): void {
    this.setPageTitle();    
  }

  // PRIVATE METHODS

  setPageTitle() {
    if(this.currentAction == "new")
      this.pageTitle = this.createPagetitle();
    else{
      this.pageTitle = this.editionPagetitle();
    }
  }

  protected createPagetitle(){
    return "Novo"
  }

  protected editionPagetitle(){
    return "Edição"
  }

  protected setCurrentAction() {
    if(this.route.snapshot.url[0].path == "new"){
      this.currentAction = "new";
    }else{
      this.currentAction = "edit";
    }
  }

  protected loadResource() {
    if(this.currentAction == "edit"){
      this.route.paramMap.pipe(
        switchMap(params => this.resourceService.getById(params.get('id')))
      )
      .subscribe(
        (res) => {
          this.resource = Object.assign(res.data());
          this.resourceForm.setValue(this.resource);          
        },
        (err) => {
          this.handleError(err);
        }
      )
    }
  }  
  
    // PRIVATE METHODS

    protected handleError(error: any[]): Observable<any>{    
      console.log("ERRO NA REQUISIÇÂO => ",  error);
      return throwError(error);    
    }

  protected abstract buildResourceForm(): void;  

  protected abstract onSubmit(): void;

}
