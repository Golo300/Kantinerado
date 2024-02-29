import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MealserviceService } from '../mealplan.service';
import { Dish, Day, Mealplan } from '../Mealplan';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrl: './detail-view.component.css'
})
export class DetailViewComponent implements OnInit {
  private day!: number;
  private kw!: number;
  mealplan!: Mealplan;
  dishes!: Dish[];

  private route = inject(ActivatedRoute);
  private mealService = inject(MealserviceService);

  ngOnInit(): void {
    const kw = this.route.snapshot.paramMap.get('kw');
    const day = this.route.snapshot.paramMap.get('day');

    if (kw && day) {
      this.day = +day;
      this.kw = +kw;
    }

    this.getMealplan();

    const detailDay = this.mealplan.days.find(e => (e.id == this.day));

    if (detailDay) {
      this.dishes = detailDay.dishes;
    }
  }

  getMealplan(): void {
    this.mealService.getMealplan(this.kw)
      .subscribe(meaplan => this.mealplan = meaplan);
  }
}
