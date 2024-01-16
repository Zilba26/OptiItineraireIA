import "./style.css";
import L, { Map } from "leaflet";
import "leaflet/dist/leaflet.css";
import { main, predictForRoute } from "./prediction";
import { Sequential } from "@tensorflow/tfjs";

let model: Sequential;
let map: Map;

main().then((modelResult: any) => {
  console.log("model: " + modelResult);
  model = modelResult;
  document.getElementById("map")!.innerHTML = "";

  map = L.map("map");
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);
  
  map.setView([47.21818239970725, -1.5520947541977976], 12);
});

document.getElementById("submit")!.addEventListener("click", submit);

function submit() {
  if (!isLoading()) {
    const date = document.getElementById("date") as HTMLInputElement;
    const time = document.getElementById("time") as HTMLInputElement;
    const dateValue = date.value;
    const timeValue = time.value;
    if (dateValue == "" || timeValue == "") {
      alert("Veuillez renseigner une date et une heure");
      return;
    }
    console.log("date: " + dateValue + " time: " + timeValue);
    const dateSplit = dateValue.split("-");
    const timeSplit = timeValue.split(":");
    const year = parseInt(dateSplit[0]);
    const month = parseInt(dateSplit[1]) - 1;
    const day = parseInt(dateSplit[2]);
    const hours = parseInt(timeSplit[0]);
    const minutes = parseInt(timeSplit[1]);
    console.log("year: " + year + " month: " + month + " day: " + day + " hours: " + hours + " minutes: " + minutes);
    const dateObject = new Date(year, month, day, hours, minutes);
    console.log("dateObject: " + dateObject);
    setData(dateObject);
  } else {
    alert("Veuillez patienter pendant le chargement des données");
  }
}

function isLoading(): boolean {
  return document.getElementById("loader") != null;
}

function setData(date: Date) {
  clearMap();
  fetch("nantes_json/244400404_fluidite-axes-routiers-nantes-metropole.json").then(response => response.json()).then((data: any[]) => {
    data.forEach((dataPoint) => {
      const id = dataPoint.fields.cha_id;
      const coordinates = dataPoint.fields.geo_shape.coordinates;
      // console.log("data id: " + id + " with name " + dataPoint.fields.cha_lib);
      const roadData = {
        "id": id,
        "timestamp": convertDateToTimestamp(date),
      }
      predictForRoute(model, roadData).then((traffic: any) => {
        console.log("traffic: " + traffic);
        if (roadData.id == 221) {
          console.log("PREDICTIONS : " + traffic);
          L.polyline(
            coordinates.map((coordinate: any) => L.latLng(coordinate[1], coordinate[0])), 
            { color: "purple", opacity: 1, weight: 5 }
          ).addTo(map);
        } else {
          L.polyline(
            coordinates.map((coordinate: any) => L.latLng(coordinate[1], coordinate[0])), 
            { color: getColorFromStringTraffic(traffic), opacity: 0.6, weight: 2 }
          ).addTo(map);
        }
      });
    });
  });
}

function convertDateToTimestamp(date: Date): string {

  // Obtenir les composants de la date
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2); // Les mois commencent à 0
  var day = ('0' + date.getDate()).slice(-2);
  var hours = ('0' + date.getHours()).slice(-2);
  var minutes = ('0' + date.getMinutes()).slice(-2);
  var seconds = ('0' + date.getSeconds()).slice(-2);
  var timezoneOffset = ('0' + (date.getTimezoneOffset() / 60)).slice(-2);

  // Construire la chaîne de date au format souhaité
  var formattedDate = year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '+' + timezoneOffset + ':00';
  return formattedDate;
}

function getColorFromStringTraffic(traffic: string): string {
  switch (traffic.toUpperCase()) {
    case "FLUIDE":
      return "green";
    case "DENSE":
      return "orange";
    case "SATURÉ":
      return "red";
    default:
      console.error("Traffic not recognized: " + traffic);
      return "black";
  }
}

setInterval(() => {
  if (isLoading()) {
    const loader = document.getElementById("loader")!;
    if (loader.innerHTML.slice(-3) == "...") {
      loader.innerHTML = loader.innerHTML.slice(0, -3);
    } else {
      loader.innerHTML += ".";
    }
  }
}, 500);

function clearMap() {
  const m = map as any;
  for(let i in m._layers) {
      if(m._layers[i]._path != undefined) {
          try {
              m.removeLayer(m._layers[i]);
          }
          catch(e) {
              console.log("problem with " + e + m._layers[i]);
          }
      }
  }
}