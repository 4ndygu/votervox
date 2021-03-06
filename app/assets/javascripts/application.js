// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or any plugin's vendor/assets/javascripts directory can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/rails/sprockets#sprockets-directives) for details
// about supported directives.
//
//= require jquery
//= require jquery_ujs
//= require jquery-ui/datepicker
//= require ahoy
//= require_tree .

//return URL parameter values
$.urlParam = function(name){
  var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
  return (results ? results[1] : 0 );
}
// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

var placeSearch, autocomplete;
var componentForm = {
  street_number: 'short_name',
  route: 'long_name',
  locality: 'long_name',
  administrative_area_level_1: 'short_name',
  country: 'long_name',
  postal_code: 'short_name'
};

function initAutocomplete() {
  // Create the autocomplete object, restricting the search to geographical
  // location types.
  autocomplete = new google.maps.places.Autocomplete(
      /** @type {!HTMLInputElement} */(document.getElementById('autocomplete')),
      {types: ['geocode']});

  // When the user selects an address from the dropdown, populate the address
  // fields in the form.
  autocomplete.addListener('place_changed', fillInAddress);
}

function fillInAddress() {
  // Get the place details from the autocomplete object.
  var place = autocomplete.getPlace();

  for (var component in componentForm) {
    document.getElementById(component).value = '';
    document.getElementById(component).disabled = false;
  }

  // Get each component of the address from the place details
  // and fill the corresponding field on the form.
  for (var i = 0; i < place.address_components.length; i++) {
    var addressType = place.address_components[i].types[0];
    if (componentForm[addressType]) {
      var val = place.address_components[i][componentForm[addressType]];
      document.getElementById(addressType).value = val;
    }
  }

  // Fill in latitude and longitude
  document.getElementById('latitude').value = place.geometry.location.lat();
  document.getElementById('longitude').value = place.geometry.location.lng();
}


function tooltip(){
  $('a.tooltip-hover').hover(function(){
    $('div.tooltip').toggleClass('hide');
  })
}

//Mobile Nav Menu

function mobileNav() {
  $('.menu-icon').click( function(e){
    e.preventDefault();
    var menu = $(this);
    var opened = $(this).hasClass('opened');
    if ( !opened ) {
      $('header nav').slideDown(1000, function(){
        menu.addClass('opened');

      });
    } else {
      $('header nav').slideUp(1000, function(){
        menu.removeClass('opened');
      });
    }
    
  })
}

//open and close filters for /voter-resources & /matches
function filterShow() {
  $('a.filters').click( function(){
    $('section.filters div.filters').toggleClass('hide');
    $('i.search-fa').toggleClass('fa-caret-up').toggleClass('fa-caret-down');
  })
}
//filter Matches

function showMatches(){
  $('a.matches-toggle').click( function(e){
    e.preventDefault();
    //highlight the selected toggle
    $('.matches-toggle').removeClass('current');
    $(this).addClass('current');
    //show the selected voter types and hide the rest using data-voters attribute
    var matchesType = $(this).attr('data-matches');
    if ($('#'+matchesType).length) {
      $('.voter-boxes').addClass('hide');
      $('#'+ matchesType).removeClass('hide');
    }
  });
}

//Metrics Time Selection
function showTime(){
  $('input.week').click( function(e){
    $(this).addClass('current');
    $('input.month, input.all_time').removeClass('current');
  });
  $('input.month').click( function(e){
    $(this).addClass('current');
    $('input.week, input.all_time').removeClass('current');
  });
  $('input.all_time').click( function(e){
    $(this).addClass('current');
    $('input.month, input.week').removeClass('current');
  });
}
//lightbox display with data attribute lightbox
function showLightBox() {
  $('.lightbox-button').click( function(e){
    e.preventDefault();
    var lightboxID = $(this).attr('data-lightbox');
    if ($('#'+lightboxID).length) {
      $('#'+lightboxID).removeClass('hide');
      $('.green-overlay').removeClass('hide');
      //if user clicks on green overlay it will hide all lightboxes 
      $('.green-overlay').click(function(){ 
        $('.lightbox, .green-overlay').addClass('hide');
      })
      $('html, body').animate({
        scrollTop: $("html, body").offset().top
      }, 1000);
    }
  });
}

function closeLightBox() {
  $('.lightbox .close-icon').click(function(){
    $(this).parent().addClass('hide');
    $('.green-overlay').addClass('hide');
  })
}


/* FILE UPLOAD - get filename that will be uploaded and display in fake placeholder field*/
function getFilePath(){
     $('input[type=file]').change(function () {
         var filename=$('#file_upload')[0].files[0].name;
         $('#file_name').prop('placeholder',filename);
     });
}

// Create pop up
function createPopup(url) {
 return window.open(url,'login','toolbar=0,status=0,width=640,height=480');
}

$(document).ready(function(){
  tooltip();
  mobileNav();
  getFilePath();
  showMatches();
  showLightBox();
  closeLightBox();
  filterShow();
  showTime();
  showVoters();
  showVolunteers();
  $('input.datepicker').datepicker({
    dateFormat: "yy-mm-dd"
  });

  $('.popup-link').click(function() {
   createPopup(this.href);
   return false;
  });

  //on homepage language select, submit form
  if ( $('section.getting-started').has("form") ) {
    $('#locale').change(function() {
        this.form.submit();
    });
  }
 
});



//display navigation links if nav is hidden when browser size is larger than tablet

$( window ).resize(function() {
  var windowWidth = $(window).width();
  var hiddenNav = $('header nav').hasClass('hide');
  if ( windowWidth >= 640 && hiddenNav ) {
    $('header nav').removeClass('hide');
  }
});

