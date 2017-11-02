var app = app || {};

app.FoodModel = Backbone.Model.extend({
    defaults: {
        databaseId: -1,
        name: '',
        calories: 0,
        brandname: '',
        date: '',
    },
    add: function() {
        var database = new app.Database();
        database.addFood(this);
    },
    remove: function() {
        var database = new app.Database();
        database.removeFood(this);
    }
});

app.ProfileModel = Backbone.Model.extend({
    defaults: {
        totalCalories: 0
    },
    initialize: function() {
        this.update();
    },
    update: function() {
        var totalCalories = 0;
        var database = new app.Database();

        database.getFoods().forEach(function(food) {
            totalCalories += food.calories;
        });

        this.set('totalCalories', totalCalories);
    },
});