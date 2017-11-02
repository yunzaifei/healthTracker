var app = app || {};

var foodCollection = new app.FoodCollection([]);
var profileModel = new app.ProfileModel({});
var foodCollectionView = new app.FoodCollectionView({
    collection: foodCollection,
    profile: profileModel
});
var profileView = new app.ProfileView({ model: profileModel });

$('#foods').html(foodCollectionView.render().el);
$('#profile').html(profileView.render().el);

profileView.update();