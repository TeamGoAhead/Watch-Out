// Jquery
$(function () {
    var header = $('header');
    var form = $('form');
    var input = $('.form-control');
    var search = $('#search');
    var results = $('#results');
    var searchButton = $('form .btn');
    $(results).hide();

    function go () {
        $(header).fadeOut('slow', function() {

        });
        $(search).animate({
            marginTop: '20px'
        }, 800);
        $(input).animate({
            height: '40px'
        }, 0);
        $(form).removeClass('form-horizontal').addClass('form-inline');
        $(searchButton).removeClass('btn-block').removeClass('btn-default').addClass('btn-search-top');
        setTimeout(function () {
            $(results).show().addClass('animated fadeIn');
        }, 1000);
    }


    $(form).submit(function (e){
        e.preventDefault();
        go();

    }); // FORM SUBMIT
    $(searchButton).click(function(event) {
        go();
    });
});
