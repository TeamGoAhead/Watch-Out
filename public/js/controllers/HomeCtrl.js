var app = angular.module('watchOut');

app.controller('HomeCtrl', function ($scope, $firebaseArray) {

    var ref = firebase.database().ref().child('locations');
    var users = $firebaseArray(ref);


    $scope.watchOut = function () {
        navigator.geolocation.getCurrentPosition(function (pos) {
            console.log(pos.coords);
            var location = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            };
            users.$add(location)
                .then(function (ref) {
                    var id = ref.key;
                    console.log('the location id is ' + id);
                    users.$indexFor(id);
                });
        });
    }

    var positions = firebase.database().ref('locations');
    positions.on('value', function (snap) {
        console.log(snapshotToArray(snap));
    });

    function snapshotToArray(snapshot) {
        var returnArr = [];

        snapshot.forEach(function (childSnapshot) {
            var item = childSnapshot.val();
            item.key = childSnapshot.key;

            returnArr.push(item);
        });

        return returnArr;
    };

});