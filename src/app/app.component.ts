import { Component, OnInit, ViewChild } from '@angular/core';
import * as L from 'leaflet';

export class Building {
  lat: number;
  lng: number;
  sub_zone_id: number;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  addresses=[];
  frompoints = [];
  topoints = [];
  geojson: any;
  building: Building;
  locateId:any;
  myPosition:L.Marker;
  myCircle:L.Circle;
  latlng: any;
  isLocationOn:boolean;
  map: L.Map;
  search: L.Control;
  gotoPlaceMarker: L.Marker;
  geojsonpath: any;
  showsearchbox=true;
  showdirbox = false;
  startMarker: L.Marker;
  endMarker: L.Marker;



  greenMarker = L.icon({
    iconUrl: 'assets/marker-green.png',
    iconSize: [15, 15]
  });

  redMarker = L.icon({
    iconUrl: 'assets/marker-red.png',
    iconSize: [15, 15]
  });

  myMarker = L.icon({
    iconUrl: 'assets/mymarker.png',
    iconSize: [20, 20]
  });

  pinMarker = L.icon({
    iconUrl: 'assets/marker-icon.png',
    iconSize: [20,30]
  })

  constructor(
  ) {
    this.building = new Building();
  }



  ngOnInit() {
    this.renderMap();
  }



  //convert all to pascal case. Not needed as of now since fuzzy string is taking care of the matching
  renderMap() {
    var sat = L.tileLayer('https://mt0.google.com/vt/lyrs=s&hl=en&x={x}&y={y}&z={z}', {
      maxZoom: 20,
      minZoom: 13,
    });
    var osm = L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      maxZoom: 20,
      minZoom: 13,
    });
    var drukmap= L.tileLayer.wms('http://{s}.myhome.bt:8080/geoserver/bhutan/wms', {
      layers: 'bhutan:thimphu',
      maxZoom: 20,
      minZoom: 13,
      format: 'image/png',
      transparent: true
    });

    this.map = L.map('map',{
      center:[27.4712,89.64191],
      zoom: 13,
      maxZoom: 20,
      layers: [sat]
    });

    var streeTile = L.tileLayer.wms('http://{s}.myhome.bt:8080/geoserver/bhutan/wms', {
      layers: 'bhutan:street_11august',
      maxZoom: 25,
      minZoom: 13,
      format: 'image/png',
      transparent: true
    }).addTo(this.map);

    var bldgTile = L.tileLayer.wms('http://{s}.myhome.bt:8080/geoserver/bhutan/wms', {
      layers: 'bhutan:building_numbers_11august',
      maxZoom: 25,
      minZoom: 13,
      format: 'image/png',
      transparent: true
    }).addTo(this.map);

    this.map.zoomControl.setPosition("topright");

    var baseMaps = {
      "Satellite Image": sat,
      "OSM base map": osm, 
      "Drukmap Base": drukmap
    };



    var overlayMaps = {
      "Buildings": bldgTile,
      "Streets": streeTile,
    }


    let postbody = {
      "a":[123,12],
      "b":[1,1]
    }
  
    L.control.layers(baseMaps,overlayMaps).addTo(this.map);

    this.map.on('locationerror',(err)=>{
          if (err.code === 0) {
            
          }
          if (err.code === 1) {
            
          }
          if (err.code === 2) {
            
          }
          if (err.code === 3) {
             
            }
    });

    this.map.on('locationfound',(e)=>{
      var radius = e.accuracy;
      this.latlng = e
      if(this.myPosition !== undefined){
        this.map.removeLayer(this.myPosition);
      }
      this.myPosition = L.marker(e.latlng,{icon: this.myMarker}).addTo(this.map);

      if(this.myCircle!== undefined){
        this.map.removeLayer(this.myCircle);
      }
      if(radius<100){
        this.myCircle = L.circle(e.latlng,radius).addTo(this.map);
      }
    });
  }

}

