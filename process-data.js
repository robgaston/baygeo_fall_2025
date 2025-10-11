import { collect, pointsWithinPolygon } from "@turf/turf";
import fs from "fs";
import sites from "./map/sites.json" with {type: "json"};
import neighborhoods from "./map/neighborhoods.json" with {type: "json"};

neighborhoods.features.forEach((feature) => {
    feature.properties.sitesCount = pointsWithinPolygon(sites, feature).features.length;
});

delete neighborhoods.crs;
delete neighborhoods.name;

fs.writeFileSync("./map/neighborhoods-with-sites.json", JSON.stringify(neighborhoods, null, "\t"));

console.log("success. 👍");