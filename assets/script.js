var searchBtn = document.querySelector("#searchBtn");
var cityname = document.querySelector("#cityname");
var pastBtn = document.querySelector('.past')
var searchvalue = [];

/////////////////////////when page loads///////////////////////////////
function init() {
    var storedsearch = JSON.parse(localStorage.getItem("searchvalue"));
    if (storedsearch !== null) {
        searchvalue = storedsearch; 
    }
    renderlist();
}

///////////////////////////////get the postion of city////////////////////////////////////////
function getPosition(city){
    var weatherurl = "https://api.openweathermap.org/data/2.5/forecast?q="+ city +"&appid=feb634c81e9486b3baa517c80e55efd3"
    fetch(weatherurl)
      .then(function (response) {
          if (!response.ok) {
            $('#5day').empty();
            $('#main-icon').attr('src','').attr('alt','');
            $('#main-temp').text('');
            $('#main-wind').text('');
            $('#main-hum').text('');
            $('#main-uv').text('');
            $('#sub-title').text('');
            $('#cityname').text('Error: '+response.status +', invalid input');
            throw response.json();
          }
  
        return response.json();
      })
      .then(function (weatherRes) {
        var citycoord = weatherRes.city.coord;
        var coordvalue = Object.values(citycoord)
        var lat = coordvalue[0];
        var lon = coordvalue[1];
        Getweather(lat,lon);
  
      })
      .catch(function (error) {
        console.error(error);
      });
}

////////////////////////////////////////////gets the weather///////////////////////////////////////////////
function Getweather(lat, lon){
  var uvurl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=hourly,minutely&units=metric&appid=feb634c81e9486b3baa517c80e55efd3"
  fetch(uvurl)
    .then(function (response) {
        if (!response.ok) {
          throw response.json();
        }

      return response.json();
    })
    .then(function (uvRes) {
      console.log(uvRes);
      renderweather(uvRes);
    })
    .catch(function (error) {
      console.error(error);
    });
}

//////////////////////////////////////renders the weather to page///////////////////////////////////////////
function renderweather(uvRes){
  var iconobject = Object.values(uvRes.daily[0].weather[0])
  var iconvalue = iconobject[3]
  var icontext = iconobject[1]
  $('#cityname').text(searchtext.charAt(0).toUpperCase() + searchtext.slice(1)+" "+ moment().format("(DD/MM/YY)") );
  $('#main-icon').attr('src','http://openweathermap.org/img/wn/'+ iconvalue +'@2x.png').attr('alt', icontext);
  $('#main-temp').text('Temp: ' + uvRes.daily[0].temp.day +'°C');
  $('#main-wind').text('Wind: ' + uvRes.daily[0].wind_speed +'km/h');
  $('#main-hum').text('Humidity: '+uvRes.daily[0].humidity +'%');
  $('#main-uv').text('UV Index: '+uvRes.daily[0].uvi);
  $('#sub-title').text('5-Day Forecast:');
  $('#5day').empty();
  for (var i = 1; i < 6; i++) {
    var subiconobject = Object.values(uvRes.daily[i].weather[0])
    var subiconvalue = subiconobject[3]
    var subicontext = subiconobject[1]
    $('#5day').append(
      $('<div></div>').addClass('sub col-12 colcust-lg mb-2').append([
        $('<h5></h5>').text(moment().add(i, 'days').format("(DD/MM/YY)")),
        $('<img></img>').attr('src','http://openweathermap.org/img/wn/'+ subiconvalue +'@2x.png').attr('alt', subicontext),
        $('<p></p>').text('Temp: ' + uvRes.daily[i].temp.day +'°C'),
        $('<p></p>').text('Wind: ' + uvRes.daily[i].wind_speed +'km/h'),
        $('<p></p>').text('Humidity: '+uvRes.daily[i].humidity +'%'),
      ])
    )
  }
}

///////////////////////////////renders the list of button///////////////////////////////////////
function renderlist(){
    $('#sidebar').children('button').remove();
    var search = searchvalue;
    for (var i = 0; i < search.length; i++) {
        var searchs = search[i];
        var Btn = document.createElement("button");
        Btn.textContent = searchs.charAt(0).toUpperCase() + searchs.slice(1);
        Btn.setAttribute("id", searchs);
        Btn.setAttribute("class","btn btn-primary btn-block");
        $('#sidebar').append(Btn);
    }
}

///////////////////////////////stores the search values/////////////////////////////////////////
function storescore(){
    localStorage.setItem("searchvalue", JSON.stringify(searchvalue));
}

///////////////////////////////search button//////////////////////////////
searchBtn.addEventListener("click", function(event){
    event.preventDefault();
    var searchinput = document.querySelector("#search-input").value 
    searchtext = searchinput.toLowerCase();
    if(searchtext === ""){
        return;
    };
    if(!searchvalue.includes(searchtext)){
      if(searchvalue.length > 7){
        searchvalue.splice(searchvalue.length-1 , 1)
        searchvalue.splice(0 , 0 , searchtext);
        searchinput.value = "";
        storescore();
        renderlist();
      }else{
        searchvalue.splice(0 , 0 , searchtext);
        searchinput.value = "";
        storescore();
        renderlist();
      }
    }
    console.log(searchvalue.length)  
    getPosition(searchinput);
});

//////////////////////////////list button///////////////////////////////////////
$(document).on('click','.btn-primary',function(){
  $('#5day').empty();
  var reinput = $(this).attr('id');
  searchtext = reinput
  getPosition(searchtext);
});

init();

