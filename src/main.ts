import './style.css'
import L from "leaflet";
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine';

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
<ods-dataset-context context="ctx" ctx-dataset="comptages-routiers-permanents" ctx-parameters="{'disjunctive.libelle':true,'disjunctive.etat_trafic':true,'disjunctive.libelle_nd_amont':true,'disjunctive.libelle_nd_aval':true}">
    <div class="container-fluid">
            <div class="row">
            <div class="col-md-12">
                <div class="ods-box">
                <h2>
                    Moyenne sur la période sélectionnée du débit et du taux d'occupation (échelle mensuelle)
                    <div style="color:#FB3A4A;font-size:0.7em;">
                    (Personnalisez cette data visualisation en filtrant la donnée (sur la gauche))
                    </div>
                    <div style="color:#2EBC2B;font-size:0.7em;">
                    <br/>Cette dataviz donne à voir la donnée brute telle qu'elle est publiée, ce n'est en aucun cas un tableau de bord caractérisant la circulation à Paris.
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    <br/>Elle expose :
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    - Le débit qui correspond au nombre de véhicules ayant passé le point de comptage pendant un intervalle de temps fixe (une heure pour les données fournies,
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    - Le taux d’occupation, qui correspond au temps de présence de véhicules sur la boucle en pourcentage d’un intervalle de temps fixe (une heure pour les données fournies). Ainsi, 25% de taux d’occupation sur une heure signifie que des véhicules ont été présents sur la boucle pendant 15 minutes. Le taux fournit une information sur la congestion routière.
                    </div>
                </h2>
                 <ods-chart align-month="true" labels-x-length="30" timescale="month">
                    <ods-chart-query context="ctx" field-x="t_1h" maxpoints="0" timescale="month">
                        <ods-chart-serie chart-type="column" color="#FFCD00" display-units="false" display-values="true" expression-y="q" function-y="AVG" label-y="Débit horaire moyen sur un mois" scientific-display="true">
                        </ods-chart-serie>
                        <ods-chart-serie chart-type="spline" color="#6666ff" display-values="true" expression-y="k" function-y="AVG" label-y="Taux d'occupation horaire moyen sur un mois" scientific-display="true">
                        </ods-chart-serie>
                    </ods-chart-query>
                 </ods-chart>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="ods-box">
                <h2>
                    Moyenne sur la période sélectionnée du débit et du taux d'occupation (échelle journalière)
                    <div style="color:#FB3A4A;font-size:0.7em;">
                    (Personnalisez cette data visualisation en filtrant la donnée (sur la gauche))
                    </div>
                    <div style="color:#2EBC2B;font-size:0.7em;">
                    <br/>Cette dataviz donne à voir la donnée brute telle qu'elle est publiée, ce n'est en aucun cas un tableau de bord caractérisant la circulation à Paris.
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    <br/>Elle expose :
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    - Le débit qui correspond au nombre de véhicules ayant passé le point de comptage pendant un intervalle de temps fixe (une heure pour les données fournies),
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    - Le taux d’occupation, qui correspond au temps de présence de véhicules sur la boucle en pourcentage d’un intervalle de temps fixe (une heure pour les données fournies). Ainsi, 25% de taux d’occupation sur une heure signifie que des véhicules ont été présents sur la boucle pendant 15 minutes. Le taux fournit une information sur la congestion routière.
                    </div>
                </h2>
                  <ods-chart align-month="true" labels-x-length="30" timescale="day">
                    <ods-chart-query context="ctx" field-x="t_1h" maxpoints="0" timescale="day">
                        <ods-chart-serie chart-type="column" color="#FFCD00" display-units="false" display-values="false" expression-y="q" function-y="AVG" label-y="Débit horaire moyen sur 24h" scientific-display="true">
                        </ods-chart-serie>
                        <ods-chart-serie chart-type="spline" color="#6666ff" display-values="false" expression-y="k" function-y="AVG" label-y="Taux d'occupation horaire moyen sur 24h" scientific-display="true">
                        </ods-chart-serie>
                    </ods-chart-query>
                  </ods-chart>
                </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="ods-box">
                <h2>
                    Moyenne du débit et du taux d'occupation (échelle horaire)
                    <div style="color:#FB3A4A;font-size:0.7em;">
                    (Personnalisez cette data visualisation en filtrant la donnée (sur la gauche))
                    </div>
                    <div style="color:#2EBC2B;font-size:0.7em;">
                    <br/>Cette dataviz donne à voir la donnée brute telle qu'elle est publiée, ce n'est en aucun cas un tableau de bord caractérisant la circulation à Paris.
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    <br/>Elle expose :
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    - Le débit qui correspond au nombre de véhicules ayant passé le point de comptage pendant un intervalle de temps fixe (une heure pour les données fournies),
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    - Le taux d’occupation, qui correspond au temps de présence de véhicules sur la boucle en pourcentage d’un intervalle de temps fixe (une heure pour les données fournies). Ainsi, 25% de taux d’occupation sur une heure signifie que des véhicules ont été présents sur la boucle pendant 15 minutes. Le taux fournit une information sur la congestion routière.
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    <br/>L'horodate horaire de la donnée est effectué en fin de période d'élaboration, la dataviz est donc décalée de h+1.  Par exemple, l’horodate « 2019-01-01 01:00:00 » désigne la période du 1er janvier 2019 à 00h00 au 1er janvier 2019 à 01h00.
                    </div>
                </h2>
                      <ods-chart align-month="true" labels-x-length="30" timescale="hour">
                        <ods-chart-query context="ctx" field-x="t_1h" maxpoints="0" timescale="hour">
                            <ods-chart-serie chart-type="column" color="#FFCD00" display-units="false" display-values="false" expression-y="q" function-y="AVG" label-y="Débit horaire moyen" scientific-display="true">
                            </ods-chart-serie>
                            <ods-chart-serie chart-type="spline" color="#6666ff" display-values="false" expression-y="k" function-y="AVG" label-y="Taux d'occupation horaire moyen" scientific-display="true">
                            </ods-chart-serie>
                        </ods-chart-query>
                      </ods-chart>
                </div>
            </div>
        </div> 
    </div>   
        <div class="row">
            <div class="col-md-6">   
                <div class="ods-box">
                <h2>
                    Profil de la journée d'hier - Moyenne horaire du débit et du taux d'occupation
                    <div style="color:#2EBC2B;font-size:0.7em;">
                    <br/>Cette dataviz donne à voir la donnée brute telle qu'elle est publiée, ce n'est en aucun cas un tableau de bord caractérisant la circulation à Paris.
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    <br/>Elle expose :
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    - Le débit qui correspond au nombre de véhicules ayant passé le point de comptage pendant un intervalle de temps fixe (une heure pour les données fournies),
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    - Le taux d’occupation correspond au temps de présence de véhicules sur la boucle en pourcentage d’un intervalle de temps fixe (une heure pour les données fournies). Ainsi, 25% de taux d’occupation sur une heure signifie que des véhicules ont été présents sur la boucle pendant 15 minutes. Le taux fournit une information sur la congestion routière.
                    </div>
                     <div style="color:#071F32;font-size:0.6em;">
                    <br/>L'horodate horaire de la donnée est effectué en fin de période d'élaboration, la dataviz est donc décalée de h+1.  Par exemple, l’horodate « 2019-01-01 01:00:00 » désigne la période du 1er janvier 2019 à 00h00 au 1er janvier 2019 à 01h00.
                    </div>
                </h2>
                 <ods-dataset-context comptagesroutierspermanents-dataset="comptages-routiers-permanents" comptagesroutierspermanents-parameters="{'disjunctive.libelle':true,'disjunctive.libelle_nd_amont':true,'disjunctive.libelle_nd_aval':true,'disjunctive.etat_trafic':true,'disjunctive.etat_barre':true,'timezone':'Europe/Berlin','sort':'t_1h','q':'t_1h &lt;= #now(days=-1,hour=23,minute=0,second=0) AND date &gt;= #now(days=-1,hour=0,minute=0,second=0)'}" context="comptagesroutierspermanents">
                    <ods-chart align-month="true" timescale="hour">
                        <ods-chart-query context="comptagesroutierspermanents" field-x="t_1h" maxpoints="0" timescale="hour">
                            <ods-chart-serie chart-type="column" color="#009999" display-units="false" display-values="true" expression-y="q" function-y="AVG" label-y="Débit horaire moyen" scientific-display="true">
                            </ods-chart-serie>
                            <ods-chart-serie chart-type="areaspline" color="#FB3A4A" display-units="false" display-values="true" expression-y="k" function-y="AVG" label-y="Taux d'occupation horaire moyen" scientific-display="true">
                            </ods-chart-serie>
                        </ods-chart-query>
                    </ods-chart>
                </ods-dataset-context>
                </div>
            </div>
            <div class="col-md-6">
                <div class="ods-box">
                <h2>
                    Profil des 7 derniers jours - Moyenne quotidienne du débit et du taux d'occupation
                    <div style="color:#2EBC2B;font-size:0.7em;">
                    <br/>Cette dataviz donne à voir la donnée brute telle qu'elle est publiée, ce n'est en aucun cas un tableau de bord caractérisant la circulation à Paris.
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    <br/>Elle expose :
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    - Le débit qui correspond au nombre de véhicules ayant passé le point de comptage pendant un intervalle de temps fixe (une heure pour les données fournies),
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    - Le taux d’occupation correspond au temps de présence de véhicules sur la boucle en pourcentage d’un intervalle de temps fixe (une heure pour les données fournies). Ainsi, 25% de taux d’occupation sur une heure signifie que des véhicules ont été présents sur la boucle pendant 15 minutes. Le taux fournit une information sur la congestion routière.
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    <br/><br/><br/><br/>
                    </div>
                </h2>
               <ods-dataset-context comptagesroutierspermanents-dataset="comptages-routiers-permanents" comptagesroutierspermanents-parameters="{'disjunctive.libelle':true,'disjunctive.libelle_nd_amont':true,'disjunctive.libelle_nd_aval':true,'disjunctive.etat_trafic':true,'disjunctive.etat_barre':true,'timezone':'Europe/Berlin','sort':'t_1h','q':'t_1h &lt;= #now(days=-1,hour=23,minute=0,second=0) AND date &gt;= #now(days=-7,hour=0,minute=0,second=0)'}" context="comptagesroutierspermanents">
                    <ods-chart align-month="true" timescale="day">
                        <ods-chart-query context="comptagesroutierspermanents" field-x="t_1h" maxpoints="0" timescale="day">
                            <ods-chart-serie chart-type="column" color="#009999" display-units="false" display-values="true" expression-y="q" function-y="AVG" label-y="Débit horaire moyen sur 24h" scientific-display="true">
                            </ods-chart-serie>
                            <ods-chart-serie chart-type="areaspline" color="#FB3A4A" display-units="false" display-values="true" expression-y="k" function-y="AVG" label-y="Taux d'occupation horaire moyen sur 24h" scientific-display="true">
                            </ods-chart-serie>
                        </ods-chart-query>
                    </ods-chart>
                </ods-dataset-context>
                 </div>
            </div>
        </div>
        <div class="row">
            <div class="col-md-12">
                <div class="ods-box">
                <h2>
                    Profil des 3 derniers mois - Moyenne quotidienne du débit et du taux d'occupation
                    <div style="color:#2EBC2B;font-size:0.7em;">
                    <br/>Cette dataviz donne à voir la donnée brute telle qu'elle est publiée, ce n'est en aucun cas un tableau de bord caractérisant la circulation à Paris.
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    <br/>Elle expose :
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    - Le débit qui correspond au nombre de véhicules ayant passé le point de comptage pendant un intervalle de temps fixe (une heure pour les données fournies),
                    </div>
                    <div style="color:#071F32;font-size:0.6em;">
                    - Le taux d’occupation, qui correspond au temps de présence de véhicules sur la boucle en pourcentage d’un intervalle de temps fixe (une heure pour les données fournies). Ainsi, 25% de taux d’occupation sur une heure signifie que des véhicules ont été présents sur la boucle pendant 15 minutes. Le taux fournit une information sur la congestion routière.
                    </div>
                </h2>
                 <ods-dataset-context comptagesroutierspermanents-dataset="comptages-routiers-permanents" comptagesroutierspermanents-parameters="{'disjunctive.libelle':true,'disjunctive.libelle_nd_amont':true,'disjunctive.libelle_nd_aval':true,'disjunctive.etat_trafic':true,'disjunctive.etat_barre':true,'timezone':'Europe/Berlin','sort':'t_1h','q':'t_1h &lt;= #now(days=-1,hour=23,minute=0,second=0) AND date &gt;= #now(days=-90,hour=0,minute=0,second=0)'}" context="comptagesroutierspermanents">
                    <ods-chart align-month="true" timescale="day">
                        <ods-chart-query context="comptagesroutierspermanents" field-x="t_1h" maxpoints="0" timescale="day">
                            <ods-chart-serie chart-type="column" color="#009999" display-units="false" display-values="false" expression-y="q" function-y="AVG" label-y="Débit horaire moyen sur 24h" scientific-display="true">
                            </ods-chart-serie>
                            <ods-chart-serie chart-type="areaspline" color="#FB3A4A" display-units="false" display-values="false" expression-y="k" function-y="AVG" label-y="Taux d'occupation horaire moyen sur 24h" scientific-display="true">
                            </ods-chart-serie>
                        </ods-chart-query>
                    </ods-chart>
                </ods-dataset-context>
                </div>
            </div>
        </div>
       




</ods-dataset-context>`

const map = L.map('map').setView([51.505, -0.09], 13);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

L.Routing.control({
  waypoints: [
    L.latLng(57.74, 11.94),
    L.latLng(57.6792, 11.949)
  ]
}).addTo(map);

const w = L.Routing.control({
  waypoints: [
    L.latLng(57.74, 11.94),
    L.latLng(57.6792, 11.949)
  ]
})

console.log(w);
