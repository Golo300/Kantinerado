package com.app.kantinerado.models;

public class DayDishDTO {

        private int dishId;
        private Date date;

        public DayDishDTO(int dishId, Date date) {
            this.username = dishId;
            this.date = date;
        }

        public int getDishId() {
            return this.username;
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
