import { Component } from '@angular/core';
import { DishService } from '../services/dish.service';
import { OrderService } from '../services/order.service';
import { addDays, getISOWeek, setWeek } from 'date-fns';
import { Order } from '../Interfaces';

@Component({
  selector: 'app-view-order-administration',
  templateUrl: './view-order-administration.component.html',
  styleUrl: './view-order-administration.component.css'
})
export class ViewOrderAdministrationComponent {

  listOfKW: number[] = [];
  currentYear!: number;
  kwBegin!: number;
  kwEnd!: number;
 
  constructor(private dishService: DishService, private orderService: OrderService) { 

  }

  ngOnInit(): void {
    this.getKWs();  
  }

  currentKW(): number {
    const currentDate = new Date();
    this.currentYear = currentDate.getFullYear();
    return getISOWeek(currentDate);
  }

  getKWs(): void {
    // Aktuelle KW
    const kw0 = this.currentKW();
    this.kwBegin = kw0;
    // Nächste KW
    const kw1 = this.nextWeek(kw0);
    // Übernächste KW
    const kw2 = this.nextWeek(kw1);
    this.kwEnd = kw2;

    this.listOfKW.push(kw0, kw1, kw2);
  }

  nextWeek(kw: number): number {
    const monday = this.getDateFromMondayOfKW(kw);
    const nextMonday = addDays(monday, 7);
    this.currentYear = nextMonday.getFullYear();
    return getISOWeek(nextMonday);
  }

  getDateFromMondayOfKW(kw: number): Date {
    const monday = setWeek(new Date(this.currentYear, 0, 1), kw, { weekStartsOn: 1 }); // Erster Tag (Montag) der Kalenderwoche
    return monday;
  }

  downloadPDF(kw: number): void {
    this.orderService.getEveryOrderByKw(kw).subscribe((orders: Order[]) => {
      this.orderService.generateAdminPdf(orders);
    });
  }
}
