import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MealserviceService } from '../services/mealplan.service';
import { Dish, Day, Mealplan } from '../Interfaces';
import { getISOWeek } from 'date-fns/getISOWeek';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrl: './detail-view.component.css'
})
export class DetailViewComponent implements OnInit {
  day!: Date;
  dishes!: Dish[];

  private route = inject(ActivatedRoute);
  constructor(private mealService: MealserviceService, private router: Router)
  {

  }

  ngOnInit(): void {
    const dateString = this.route.snapshot.paramMap.get('day');

    if (!dateString) {
      throw new Error('Kein Datum-Parameter gefunden');
    }

    this.day = new Date(dateString);

    if (isNaN(this.day.getTime())) {
      throw new Error('Ungültiges Datumsformat');
    }

    this.getMealplan();
  }

  getMealplan(): void {

    const startOfDay = new Date(this.day);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(this.day);
    endOfDay.setHours(23, 59, 59, 999);

    this.mealService.getMealplan(startOfDay, endOfDay)
      .subscribe((days:Day[]) => {
        this.dishes = days[0].dishes
      });
  }

  routeMealplan(): void {
    const kw = getISOWeek(this.day)
    const year = this.day.getFullYear();
    this.router.navigate(['/order/' + kw + '/' + year]);
  }
}
