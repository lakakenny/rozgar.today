import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Plan } from '@app/join/models';
import * as CoreActions from '@core/actions';
import * as CoreSelectors from '@core/selectors';
import * as JoinActions from '@app/join/actions';
import * as JoinSelectors from '@app/join/selectors';
import { Collection, CollectionItem } from '@core/models';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrls: ['./plans.component.less', '../join.component.less']
})
export class PlansComponent implements OnInit, OnDestroy {
  selectedPlanId$: Observable<string>;
  plans$: Observable<CollectionItem<Plan>[]>;
  isLoading$: Observable<boolean>;
  joinIsProcessing$: Observable<boolean>;

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(CoreActions.loadCollection({ collection: Collection.Plans }));
    this.isLoading$ = this.store.select(CoreSelectors.selectCollectionIsLoading<Plan>(Collection.Plans));
    this.plans$ = this.store.select(CoreSelectors.entitySelectors<Plan>(Collection.Plans).selectAll);
    this.selectedPlanId$ = this.store.select(JoinSelectors.selectSelectedPlanId);
    this.joinIsProcessing$ = this.store.select(JoinSelectors.selectJoinIsProcessing);
  }

  ngOnDestroy() {
    this.store.dispatch(CoreActions.stopLoadCollection({ collection: Collection.Plans }));
  }

  next() {
    this.store.dispatch(JoinActions.nextJoinStep());
  }

  selectPlan(id: string) {
    this.store.dispatch(JoinActions.setSelectedPlan({ id }));
  }
}
