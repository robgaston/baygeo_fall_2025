<script setup>
import { onMounted, ref, computed } from "vue";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import style from "./map/style.json";
import neighborhoods from "./map/neighborhoods-with-sites.json";

const attribution = ref();
const mapContainer = ref();
const fillColorStyle = ref();
const hoverFeature = ref();

const legendEntries = computed(() => {
  const entries = [];
  let fromValue = 0;

  if (fillColorStyle.value) {
    const styleArray = fillColorStyle.value.toSpliced(0, 2);
    for (let index = 0; index < styleArray.length; index += 2) {
      const toValue = styleArray[index+1];
      const entry = {
        color: styleArray[index],
        text: (index == styleArray.length - 1) ? `>=${fromValue}` : `${fromValue}-${toValue-1}`
      }
      entries.push(entry);
      fromValue = toValue;
    }
  }

  return entries;
});

onMounted(() => {
  const map = new maplibregl.Map({
    "container": mapContainer.value,
    "style": style,
    "attributionControl": false,
    "bounds": [
      -118.65226,
      33.705553,
      -118.155705,
      34.3330508
    ],
    "fitBoundsOptions": {
      "padding": 50,
      "pitch": 45
    }
  });

  map.addControl(new maplibregl.AttributionControl({
    compact: true,
    customAttribution: attribution.value.innerHTML
  }));

  map.addControl(new maplibregl.NavigationControl());
  map.addControl(new maplibregl.ScaleControl());

  map.on("load", () => {
    map.getSource("neighborhoods")
    .setData(neighborhoods);

    fillColorStyle.value = map.getPaintProperty("neighborhoods-fill", "fill-extrusion-color");

    map.on("mousemove", "neighborhoods-fill", (event) => {
      hoverFeature.value = event.features[0];
      map.removeFeatureState({
        source: "neighborhoods"
      });
      map.setFeatureState(event.features[0], {
        hover: true
      })
    });

    map.on("mouseleave", "neighborhoods-fill", () => {
      hoverFeature.value = null;
      map.removeFeatureState({
        source: "neighborhoods"
      });
    });
  });
});
</script>

<template>
  <div class="container">
    <div class="panel">
      <div class="title">
        Cataloged historic sites in Los Angeles by neighborhood
      </div>
      <div class="subtitle">
        Rob Gaston, October 2025
      </div>
    </div>
    <div class="content">
      <div ref="mapContainer" class="map"></div>
      <div class="panel popup" v-if="hoverFeature">
        <div class="title">
          {{ hoverFeature.properties.name }}
        </div>
        <div>
          {{ hoverFeature.properties.sitesCount }} historic site(s) cataloged
        </div>
      </div>
      <div class="panel legend">
        <div class="title">
          # of sites cataloged
        </div>
        <div v-for="entry in legendEntries">
          <span class="color" v-bind:style="{ backgroundColor: entry.color }"></span>
          <span>{{ entry.text }}</span>
        </div>
      </div>
    </div>
  </div>
  <div ref="attribution" class="hidden">
    <a href="https://hpla.lacity.org/" target="_blank">
      Historic Places LA
    </a>
    |
    <a href="https://geohub.lacity.org/" target="_blank">
      Los Angeles GeoHub
    </a>
  </div>
</template>

<style scoped>
.container {
  display: flex;
  flex-flow: column;
  height: 100%;
}

.content {
  flex-grow: 1;
  position: relative;
}

.map {
  height: 100%;
}

.hidden {
  display: none;
}

.panel {
  padding: 10px;
  background-color: rgb(223, 222, 222);
  border: 1px solid black;
}

.title {
  font-weight: 600;
}

.subtitle {
  font-size: 0.9em;
}

.color {
  display: inline-block;
  height: 10px;
  width: 10px;
  border: 1px solid black;
  margin-right: 5px;
}

.legend {
  position: absolute;
  bottom: 50px;
  right: 10px;
  font-size: 0.9em;
}

.popup {
  position: absolute;
  top: 10px;
  right: 50px;
  font-size: 0.8em;
}
</style>