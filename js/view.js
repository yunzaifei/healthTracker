app.ProfileView = Backbone.View.extend({
    tagName: 'section',
    className: 'profile-view',
    template: _.template($('#profile-template').html()),
    initialize: function() {
        this.model.on('change', this.update, this);
    },
    render: function() {
        var profileTemplate = this.template(this.model.toJSON());
        this.$el.html(profileTemplate);
        return this;
    },
    update: function() {
        var self = this,
            date = null;
        // Shows the total calories of all foods in localStorage
        $('#total-calories').text(this.model.get('totalCalories'));
        $('#profile-foods').empty();

        // Loops and appends each item from localStorage
        // to the profile view.
        this.database = new app.Database();
        var foods = this.database.getFoods();
        foods.forEach(function(food) {

            var foodItemModel = new app.FoodModel({
                databaseId: food.databaseId,
                date: food.date,
                name: food.name,
                calories: food.calories,
                brandname: food.brandname,
            });

            // Converts the FoodItemModel into a profile-item
            var foodItemView = new app.FoodItemView({
                model: foodItemModel,
                className: 'food-item profile-item',
                profile: self.model
            });

            totalCaloriesToday += food.calories;

            // Appends the dates as headings from the
            // food-items to the profile view.
            if (date !== food.date || date === null) {
                var totalCaloriesToday = 0;
                date = food.date;

                // Counts the total calories for each day
                foods.forEach(function(item) {
                    if (date === item.date) {
                        totalCaloriesToday += item.calories;
                    }
                });

                // Appends and shows the date with the total
                // calories for that date.
                $('#profile-foods').prepend(
                    '<div id="date-heading" class="date-heading"><h3>' +
                    date + '</h3><p>total ' + totalCaloriesToday + '</p></div>'
                );
            }

            date = food.date;

            // Reuses FoodItemView and replaces the 'add' event
            // with a the remove event. Enables trash to be clicked.
            foodItemView.delegateEvents({ 'click #trash': 'remove' });
            $(foodItemView.render().el).insertAfter('#date-heading');
        });
    }
});

app.FoodItemView = Backbone.View.extend({
    tagName: 'section',
    className: 'food-item',
    template: _.template($('#food-item-template').html()),
    events: {
        click: 'addFood'
    },
    initialize: function(options) {
        this.profile = options.profile;
    },
    addFood: function() {
        $('#food-search-results').empty();
        this.model.add();
        this.profile.update();
    },
    render: function() {
        var foodTemplate = this.template(this.model.toJSON());
        this.$el.html(foodTemplate);
        return this;
    },
    remove: function() {
        this.model.remove();
        this.profile.update();
    },
});

app.FoodCollectionView = Backbone.View.extend({
    template: _.template($('#food-collection-template').html()),
    events: {
        'click #search-button': 'search',
        'keyup #search-bar': 'checkEnterPressed'
    },
    initialize: function(options) {
        this.profile = options.profile;
        this.collection.on('add', this.addFood, this);
    },
    render: function() {
        this.$el.html(this.template);
        return this;
    },
    search: function() {
        var self = this;
        $('#food-search-results').empty();
        $('#food-search-results').append('<i id="loading-icon" class="icon-spinner"></i>');
        var food = $('#search-bar').val();

        self.collection.reset();
        self.collection.search(food, function(successful) {
            if (successful) {
                self.collection.each(self.addFood, self);
            }
            $('#loading-icon').remove();
        });

    },
    addFood: function(food) {
        var foodItemView = new app.FoodItemView({
            model: food,
            profile: this.profile
        });
        $('#food-search-results').append(foodItemView.render().el);
    },
    checkEnterPressed: function(event) {
        if (event.keyCode === 13){
            this.search();
        }
    },
});
