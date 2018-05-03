var app = angular.module('watchOut');


app.directive('meny',function(){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){                      
            element[0].click(function(){
                $('ul').toggleClass('active'); 
            })
        }
    }
})