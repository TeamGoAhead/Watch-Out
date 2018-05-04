var app = angular.module('watchOut');

app.controller('HomeCtrl', function ($scope, $firebaseArray) {

    mapboxgl.accessToken = 'pk.eyJ1IjoibWV6YXIiLCJhIjoiY2pnZzh5amMyNDVidjJ3bGlveGEyeDZxaSJ9.eV1srEZNonNXeljsG18mww';


    var map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mezar/cjgp399qn00bc2rp3gjqgyqiy',
        center: [12.649210, 56.041578],
        zoom: 10
    });

    var light = document.getElementById('blinka');
    light.style.backgroundColor = '#ffffff';

    $scope.watchBtn = true;
    $scope.EndSessionBtn = false;




    var ref = firebase.database().ref().child('locations');
    var users = $firebaseArray(ref);

    var karta = undefined;
    var el = document.createElement('div');
    el.className = 'dot blink-2';
    el.style.backgroundColor = '#1da1f2';
    el.style.width = '19px';
    el.style.height = '22px';


    var positions = firebase.database().ref('locations');
    positions.on('value', function (snap) {
        console.log('SNAP ', snapshotToArray(snap));
        if (snapshotToArray(snap).length < 1) {
            new mapboxgl.Marker(el)
                .addTo();

        } 
        var markers = snapshotToArray(snap);

        markers.forEach(function (marker) {
            var markers = [marker.longitude, marker.latitude];
            new mapboxgl.Marker(el)
                .setLngLat(markers)
                .addTo(map);
        });

    });


    $scope.EndSession = function () {



        $scope.watchBtn = !$scope.watchBtn;
        $scope.EndSessionBtn = !$scope.EndSessionBtn;

        var light = document.getElementById('blinka');
        light.style.backgroundColor = '#d31111';

        mapboxgl.accessToken = 'pk.eyJ1IjoibWV6YXIiLCJhIjoiY2pnZzh5amMyNDVidjJ3bGlveGEyeDZxaSJ9.eV1srEZNonNXeljsG18mww';


        var map = new mapboxgl.Map({
            container: 'map',
            style: 'mapbox://styles/mezar/cjgp399qn00bc2rp3gjqgyqiy',
            center: [12.649210, 56.041578],
            zoom: 10
        });

        // get localStorage
        var nowLocation = window.localStorage.getItem('location');
        console.log(nowLocation);
        firebase.database().ref().child('locations').child(nowLocation).remove();
        window.localStorage.removeItem('location');
        positions.on('value', function (snap) {
            console.log('SNAP ', snapshotToArray(snap));
            if (snapshotToArray(snap).length < 1) {
                new mapboxgl.Marker(el)
                    .addTo();
    
            } 
            var markers = snapshotToArray(snap);
    
            markers.forEach(function (marker) {
                var markers = [marker.longitude, marker.latitude];
                new mapboxgl.Marker(el)
                    .setLngLat(markers)
                    .addTo(map);
            });
    
        });
    };



    $scope.watchOut = function () {
        $scope.EndSessionBtn = true;
        $scope.watchBtn = false;
        navigator.geolocation.getCurrentPosition(function (pos) {
            console.log(pos.coords);

            // var el = document.createElement('button')
            light.style.backgroundColor = '#20aa57';
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
                            "coordinates": [location.longitude, location.latitude]
                        }
                    }
                ]
            };


            map = new mapboxgl.Map({
                container: 'map',
                style: 'mapbox://styles/mezar/cjgp399qn00bc2rp3gjqgyqiy',
                center: [location.longitude, location.latitude],
                zoom: 14
            });

            // add markers to map
            geojson.features.forEach(function (marker) {
                // create a DOM element for the marker
                var el = document.createElement('div');
                el.className = 'dot blink-2';
                el.style.backgroundColor = '#1da1f2';
                el.style.width = marker.properties.iconSize[0] + 'px';
                el.style.height = marker.properties.iconSize[1] + 'px';

                el.addEventListener('click', function () {
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
        }, null, { enableHighAccuracy: true  });

        setTimeout(function () {
            // get localStorage
            var nowLocation = window.localStorage.getItem('location');
            console.log(nowLocation);
            firebase.database().ref().child('locations').child(nowLocation).remove();
            window.localStorage.removeItem('location');
            alert('din session är slut');
            $scope.watchBtn = true;
            $scope.EndSessionBtn = false;
            var light = document.getElementById('blinka');
            light.style.backgroundColor = '#ffffff';
            $scope.watchBtn = true;
            $scope.EndSessionBtn = false;
        }, 1800000);

    }





    function snapshotToArray(snapshot) {
        var returnArr = [];

        snapshot.forEach(function (childSnapshot) {
            var item = childSnapshot.val();

            returnArr.push(item);
        });

        return returnArr;
    };







});