//載入地圖
const map = L.map('map', {
  center: [23.002825, 120.213354],
  zoom: 14
});
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

//定義marker顏色
let goldIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-gold.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});
let blueIcon = new L.Icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

//取出旅遊JSON資料
let markers = new L.MarkerClusterGroup().addTo(map);;
let xhr = new XMLHttpRequest();
xhr.open("get", "https://raw.githubusercontent.com/Poseidoncode/collection-TainanTravelMap/gh-pages/TainanFood.json");
xhr.send();
xhr.onload = function () {
  let data = JSON.parse(xhr.responseText)
  data.forEach(e => {

    let mark = goldIcon;
    markers.addLayer(L.marker([e.lat, e.long], { icon: mark }).bindPopup('<h1>' + e.name + '</h1>' + '<p>簡介: ' + e.introduction + '</p>'));
  })
  map.addLayer(markers);
}

let markers2 = new L.MarkerClusterGroup().addTo(map);;

let xhr2 = new XMLHttpRequest();
xhr2.open("get", "https://raw.githubusercontent.com/Poseidoncode/collection-TainanTravelMap/gh-pages/TainanTravel.json");
xhr2.send();
xhr2.onload = function () {
  let data = JSON.parse(xhr2.responseText)
  data.forEach(e => {
    let mark = blueIcon;
    markers2.addLayer(L.marker([e.lat, e.long], { icon: mark }).bindPopup('<h1>' + e.name + '</h1>' + '<p>簡介: ' + e.introduction + '</p>'));
  })
  map.addLayer(markers2);
}

// 收合選單
const toggle_btn = document.querySelector('.js_toggle');
const panel = document.querySelector('.panel');
toggle_btn.onclick = function(e) {
    // e.preventDefault();
    panel.classList.toggle("panelClose");

};

//取出全部資料
let alldata;

function getData(){
    const xhr3 = new XMLHttpRequest;
    xhr3.open('get','https://raw.githubusercontent.com/Poseidoncode/collection-TainanTravelMap/gh-pages/TainanData.json',true)
    xhr3.send(null);
    xhr3.onload = function(){
        alldata = JSON.parse(xhr3.responseText);
        addTownList();
        renderList();
    }
}

function init(){
    getData();
}
init();

const townSelector = document.querySelector('.townList');
function addTownList(){
    let allTown = [];
    let townStr='';
    townStr += '<option>請選擇縣市</option>'
    for(let i=0;i<alldata.length;i++){
        const townName = alldata[i].district;
        if(allTown.indexOf(townName) == -1 && townName !== ''){
          allTown.push(townName);
        townStr += `<option value="${townName}">${townName}</option>`
        }
    }
    townSelector.innerHTML = townStr;
}
townSelector.addEventListener('change', geoTownView);


//選好地區後，定位至該區
function geoTownView(e) {
  let town = e.target.value;
  let townLatLng = [];

  for (let i = 0; i < alldata.length; i++) {
      let townTarget = alldata[i].district;
      let lat = alldata[i].lat;
      let lng = alldata[i].long;

      if (townTarget == town) {
          townLatLng = [lat,lng];
      }
  }
  map.setView(townLatLng, 17);
  renderList(town);
}


//在左邊欄印出景點
function renderList(town){
  let str = '';
  for(let i = 0;i<alldata.length;i++){
      const townName = alldata[i].district;
      const landName = alldata[i].name;
      const landAddress = alldata[i].address;
      const landPhone = alldata[i].tel;
      const landCat = alldata[i].category;
      const landTime = alldata[i].open_time;

      if(townName == town){
          str+=`<ul class="landContent">
          <div class="landTitle" data-lat="${alldata[i].lat}" data-lng="${alldata[i].long}">
          <li data-name="${landName}"><span>${landName}</span></li>
          <p class="infoText"><i class="fas fa-map-marker-alt"></i> ${landAddress}</p>
          <p class="infoText"><i class="fas fa-phone"></i> ${landPhone}</p>
          <p class="infoText"><i class="fas fa-bookmark"></i> ${landCat}</p>
          <p class="infoText"><i class="far fa-calendar-alt"></i> ${landTime}</p>
          </div>
          </ul>`
      }
  }
      document.querySelector('.landList').innerHTML = str;
      var landTitle = document.querySelectorAll('.landTitle'); 
      var landNameList = document.querySelectorAll('.landContent'); 
      clickLandGeo(landTitle, landNameList);
}

function clickLandGeo(landTitle, landNameList){
  for(let i=0;i<landNameList.length;i++){
    landTitle[i].addEventListener('click',function(e){
          Lat = Number(e.currentTarget.dataset.lat);
          Lng = Number(e.currentTarget.dataset.lng);
          map.setView([Lat, Lng], 22);
          markers.eachLayer(function (layer) {
              const layerLatLng = layer.getLatLng();
              if (layerLatLng.lat == Lat && layerLatLng.lng == Lng) {
                layer.openPopup();
              }
            });
  })
}
}











