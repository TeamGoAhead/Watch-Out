var app = angular.module('watchOut');

app.controller('HomeCtrl', function ($scope, $firebaseArray) {

    mapboxgl.accessToken = 'pk.eyJ1IjoibWV6YXIiLCJhIjoiY2pnZzh5amMyNDVidjJ3bGlveGEyeDZxaSJ9.eV1srEZNonNXeljsG18mww';


    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mezar/cjgp399qn00bc2rp3gjqgyqiy',
        center: [12.649210,56.041578],
        zoom: 12
    });

    var light= document.getElementById('blinka');
    light.style.backgroundColor='#ffffff';
    
    $scope.watchBtn = true;
    $scope.EndSessionBtn = false;

    


    var ref = firebase.database().ref().child('locations');
    var users = $firebaseArray(ref);

    $scope.EndSession = function () {



        $scope.watchBtn = !$scope.watchBtn;
        $scope.EndSessionBtn = !$scope.EndSessionBtn;
        
        var light= document.getElementById('blinka');
        light.style.backgroundColor='#d31111';

        mapboxgl.accessToken = 'pk.eyJ1IjoibWV6YXIiLCJhIjoiY2pnZzh5amMyNDVidjJ3bGlveGEyeDZxaSJ9.eV1srEZNonNXeljsG18mww';


        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mezar/cjgp399qn00bc2rp3gjqgyqiy',
            center: [12.649210,56.041578],
            zoom: 12
        });
        
         // get localStorage
         var nowLocation = window.localStorage.getItem('location');
         console.log(nowLocation);
         firebase.database().ref().child('locations').child(nowLocation).remove();
         window.localStorage.removeItem('location');
    };


    
    $scope.watchOut = function () {
        $scope.EndSessionBtn = true;
        $scope.watchBtn = false;
        navigator.geolocation.getCurrentPosition(function (pos) {
            console.log(pos.coords);
            
            // var el = document.createElement('button')
            light.style.backgroundColor='#20aa57';
            var location = {
                latitude: pos.coords.latitude,
                longitude: pos.coords.longitude
            };
            
            var geojson = {
                "type": "FeatureCollection",
                "features": [
                   
                    {
                        "type": "Feature",
                        "properties": {
                            "message": "Baz",
                            "iconSize": [19, 22]
                        },
                        "geometry": {
                            "type": "Point",
                            "coordinates": [location.longitude,location.latitude]
                        }
                    }
                ]
            };
            
            map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mezar/cjgp399qn00bc2rp3gjqgyqiy',
                center: [location.longitude,location.latitude],
                zoom: 16
            });
            
            // add markers to map
            geojson.features.forEach(function(marker) {
                // create a DOM element for the marker
                var el = document.createElement('div');
                el.className = 'mapboxgl-user-location-dot';
                el.style.backgroundColor='#1da1f2';
                el.style.width = marker.properties.iconSize[0] + 'px';
                el.style.height = marker.properties.iconSize[1] + 'px';
            
                el.addEventListener('click', function() {
                    window.alert(marker.properties.message);
                });
            
                // add marker to map
                new mapboxgl.Marker(el)
                    .setLngLat(marker.geometry.coordinates)
                    .addTo(map);
            });
            users.$add(location)
                .then(function (ref) {
                    var id = ref.key;
                    console.log('the location id is ' + id);
                    users.$indexFor(id);
                    window.localStorage.setItem('location', id);
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