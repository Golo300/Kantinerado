import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealserviceService } from '../services/mealplan.service';
import { Dish, Day, Mealplan } from '../Interfaces';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrl: './detail-view.component.css'
})
export class DetailViewComponent implements OnInit {
  day!: number;
  kw!: number;
  mealplan!: Mealplan;
  dishes!: Dish[];

  private route = inject(ActivatedRoute);
  constructor(private mealService: MealserviceService, private router: Router)
  {

  }

  ngOnInit(): void {
    const kw = this.route.snapshot.paramMap.get('kw');
    const day = this.route.snapshot.paramMap.get('day');

    if (kw && day) {
      this.day = +day;
      this.kw = +kw;
    }

    this.getMealplan();
  }

  getMealplan(): void {

  }

  istWochentag(date: Date, wochentag: number): boolean {
    // Den Wochentag des gegebenen Datums abrufen (0 = Sonntag, 1 = Montag, ..., 6 = Samstag)
    const wochentagDesDatums = date.getDay();

    // Umrechnung des JavaScript-Wochentags in den angegebenen Wochentag-Index
    // (1 = Montag, 2 = Dienstag, ..., 7 = Sonntag)
    const umgerechneterWochentag = (wochentagDesDatums === 0) ? 7 : wochentagDesDatums;

    // Überprüfen, ob der umgerechnete Wochentag mit dem angegebenen Wochentag übereinstimmt
    return umgerechneterWochentag === wochentag;
}

  routeMealplan(): void {
    this.router.navigate(['/order/' + this.kw]);

  }
}
