package com.app.kantinerado.models;

import java.util.Date;

public class DayDishDTO {

        private int dishId;
        private Date date;

        public DayDishDTO() {
        }

        public DayDishDTO(int dishId, Date date) {
            this.dishId = dishId;
            this.date = date;
        }

        public int getDishId() {
            return this.dishId;
        }

        public void setDishId(int dishId) {
            this.dishId = dishId;
        }

        public Date getDate() {
            return this.date;
        }

        public void setDate(Date date) {
            this.date = date;
        }
}
