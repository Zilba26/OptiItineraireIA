import "./style.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { main } from "./prediction";
import "leaflet-routing-machine";

const map = L.map("map");

L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution:
    '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
}).addTo(map);

const roadList = [
  {
    "coordinates": [
      [
        -1.583123434893785,
        47.23518597380839
      ],
      [
        -1.57863384902866,
        47.23310863996006
      ]
    ],
    "color": "red"
  }, {
    "coordinates": [
      [
        -1.568160939861016,
        47.23568134656463
      ],
      [
        -1.566080140559598,
        47.23328459825937
      ]
    ],
    "color": "orange"
  },
  {
    "coordinates": [
      [
        -1.56156574731029,
        47.210028262117945
      ],
      [
        -1.562539243278916,
        47.21027496416676
      ],
      [
        -1.563191790976123,
        47.21029415682456
      ],
      [
        -1.566800486579925,
        47.20923708671452
      ]
    ],
    "color": "green"
  },
  {
    "coordinates": [
      [
        -1.552294562802103,
        47.23466572372188
      ],
      [
        -1.551469053128831,
        47.23498042534494
      ],
      [
        -1.55085236056989,
        47.23512504539897
      ],
      [
        -1.549423097575776,
        47.23532491490086
      ]
    ],
    "color": "green"
  },
  {
    "coordinates": [
      [
        -1.564411039393482,
        47.2156145242085
      ],
      [
        -1.563747324370985,
        47.2152768643552
      ]
    ],
    "color": "green"
  },
  {
    "coordinates": [
      [
        -1.564411039393482,
        47.2156145242085
      ],
      [
        -1.563747324370985,
        47.2152768643552
      ]
    ],
  }
];


roadList.forEach(road => {
  L.polyline(road.coordinates.map(coordinate => L.latLng(coordinate[1], coordinate[0])), { color: road.color, opacity: 1, weight: 5 }).addTo(map);
  // L.Routing.control({
  //   waypoints: road.coordinates.map(coordinate => L.latLng(coordinate[1], coordinate[0])),
  //   lineOptions: {
  //     styles: [{color: road.color, opacity: 1, weight: 5}],
  //     addWaypoints: false,
  //     extendToWaypoints: false,
  //     missingRouteTolerance: 0
  //   },
  //   addWaypoints: false,
  // }).addTo(map);
});

map.setView([47.21818239970725, -1.5520947541977976], 13);

main();

window.addEventListener("unhandledrejection", (event) => {
  console.error("Unhandled Promise Rejection:", event.reason);
});

window.addEventListener("error", (event) => {
  console.error("Error:", event.error);
});
