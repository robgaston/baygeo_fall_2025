<script setup>
import { onMounted, ref } from "vue";
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import style from "./map/style.json";
import neighborhoods from "./map/neighborhoods-with-sites.json";

const attribution = ref();
const mapContainer = ref();

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

  map.on("load", () => {
    map.getSource("neighborhoods")
    .setData(neighborhoods);
  });
});
</script>

<template>
  <div class="container">
    <div class="content">
      <div ref="mapContainer" class="map"></div>
    </div>
  </div>
  <div ref="attribution" class="hidden">
    <a href="https://maplibre.org/" target="_blank">
      MapLibre,
    </a>
    <a href="https://openfreemap.org/" target="_blank">
      OpenFreeMap
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
  position: relative
}

.map {
  height: 100%;
}

.hidden {
  display: none;
}
</style>