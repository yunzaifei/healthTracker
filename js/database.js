var app = app || {};

app.Database = function() {
    this.KEY = 'FOODLIST';
    var items = JSON.parse(localStorage.getItem(this.KEY));
    if (items === null) localStorage.setItem(this.KEY, JSON.stringify([]));

    this.ID_COUNT = 'IDCOUNT';
    var id = localStorage.getItem(this.ID_COUNT);
    if (id === null) localStorage.setItem(this.ID_COUNT, 0);
};

app.Database.prototype.getId = function() {
    var id = parseInt(localStorage.getItem(this.ID_COUNT));
    localStorage.setItem(this.ID_COUNT, ++id);
    return id;
};

app.Database.prototype.getFoods = function() {
    return JSON.parse(localStorage.getItem(this.KEY));
};

app.Database.prototype.addFood = function(food) {
    var today = new Date(),
        day = today.getDate(),
        month = today.getMonth() + 1,
        year = today.getFullYear(),
        date = year + '-' + month + '-' + day;

    var foods = this.getFoods();
    var id = this.getId();

    foods.push({
        databaseId: id,
        date: date,
        name: food.get('name'),
        calories: food.get('calories'),
        brandname: food.get('brandname')
    });

    localStorage.setItem(this.KEY, JSON.stringify(foods));
};

app.Database.prototype.removeFood = function(model) {
    var foods = this.getFoods();

    foods.forEach(function(food) {
        if (food.databaseId === model.get('databaseId')) {
            foods.splice(foods.indexOf(food), 1);
        }
    });

    localStorage.setItem(this.KEY, JSON.stringify(foods));
};

