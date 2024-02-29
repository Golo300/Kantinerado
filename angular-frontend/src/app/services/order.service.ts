import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  private product$ = new BehaviorSubject<any>({});
  selectedProduct$ = this.product$.asObservable();
  constructor() {}

  setProduct(product: any) {
    this.product$.next(product);
  }

  getLastProducts(): any[] {
    return this.product$.getValue();
  }
}
