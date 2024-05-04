{
  "version": 8,
  "name": "Klokantech Terrain",
  "metadata": {
    "mapbox:autocomposite": false,
    "mapbox:type": "template",
    "maputnik:renderer": "mbgljs",
    "openmaptiles:version": "3.x",
    "openmaptiles:mapbox:owner": "openmaptiles",
    "openmaptiles:mapbox:source:url": "https://openmaptiles.4qljc88t"
  },
  "center": [-128.427172, 50.782185],
  "zoom": 14,
  "bearing": 0,
  "pitch": 0,
  "sources": {
    "openmaptiles": {
      "type": "vector",
      "tiles": ["https://ogis-tiles.s3.ca-central-1.amazonaws.com/tiles/{z}/{x}/{y}.pbf"],
      "maxzoom": 14
    }
  },
  "glyphs": "https://example.com/fonts/{fontstack}/{range}.pbf",
  "layers": [
    {
      "id": "background",
      "type": "background",
      "paint": { "background-color": "hsl(47, 26%, 88%)" }
    },
    {
      "id": "landuse-residential",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "landuse",
      "filter": ["all", ["==", "$type", "Polygon"], ["==", "class", "residential"]],
      "layout": { "visibility": "visible" },
      "paint": { "fill-color": "hsl(47, 13%, 86%)", "fill-opacity": 0.7 }
    },
    {
      "id": "landcover_grass",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "landcover",
      "filter": ["==", "class", "grass"],
      "paint": { "fill-color": "hsl(82, 46%, 72%)", "fill-opacity": 0.45 }
    },
    {
      "id": "landcover_wood",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "landcover",
      "filter": ["==", "class", "wood"],
      "paint": {
        "fill-color": "hsl(82, 46%, 72%)",
        "fill-opacity": { "base": 1, "stops": [[8, 0.6], [22, 1]] }
      }
    },
    {
      "id": "park",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "park",
      "paint": { "fill-color": "rgba(192, 216, 151, 0.53)", "fill-opacity": 1 }
    },
    {
      "id": "landcover-ice-shelf",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "landcover",
      "filter": ["==", "subclass", "ice_shelf"],
      "layout": { "visibility": "visible" },
      "paint": { "fill-color": "hsl(47, 26%, 88%)", "fill-opacity": 0.8 }
    },
    {
      "id": "landcover-glacier",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "landcover",
      "filter": ["==", "subclass", "glacier"],
      "layout": { "visibility": "visible" },
      "paint": {
        "fill-color": "hsl(47, 22%, 94%)",
        "fill-opacity": { "base": 1, "stops": [[0, 1], [8, 0.5]] }
      }
    },
    {
      "id": "landcover_sand",
      "type": "fill",
      "metadata": {},
      "source": "openmaptiles",
      "source-layer": "landcover",
      "filter": ["all", ["in", "class", "sand"]],
      "paint": { "fill-antialias": false, "fill-color": "rgba(232, 214, 38, 1)", "fill-opacity": 0.3 }
    },
    {
      "id": "landuse",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "landuse",
      "filter": ["==", "class", "agriculture"],
      "layout": { "visibility": "visible" },
      "paint": { "fill-color": "#eae0d0" }
    },
    {
      "id": "hillshade_highlight_bright",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "hillshade",
      "maxzoom": 16,
      "filter": ["==", "level", 94],
      "paint": { "fill-color": "#fff", "fill-opacity": { "base": 1, "stops": [[14, 0], [16, 0.15]] } }
    },
    {
      "id": "hillshade_highlight_med",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "hillshade",
      "maxzoom": 16,
      "filter": ["==", "level", 90],
      "paint": { "fill-color": "#f2f2f2", "fill-opacity": { "base": 1, "stops": [[14, 0], [16, 0.15]] } }
    },
    {
      "id": "hillshade_shadow_faint",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "hillshade",
      "maxzoom": 16,
      "filter": ["==", "level", 89],
      "paint": { "fill-color": "#f2f2f2", "fill-opacity": { "base": 1, "stops": [[14, 0], [16, 0.1]] } }
    },
    {
      "id": "hillshade_shadow_med",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "hillshade",
      "maxzoom": 16,
      "filter": ["==", "level", 78],
      "paint": { "fill-color": "#f2f2f2", "fill-opacity": { "base": 1, "stops": [[14, 0], [16, 0.05]] } }
    },
    {
      "id": "hillshade_shadow_dark",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "hillshade",
      "maxzoom": 16,
      "filter": ["==", "level", 67],
      "paint": { "fill-color": "#f2f2f2", "fill-opacity": { "base": 1, "stops": [[14, 0], [16, 0.05]] } }
    },
    {
      "id": "building",
      "type": "fill",
      "source": "openmaptiles",
      "source-layer": "building",
      "minzoom": 12,
      "paint": { "fill-color": "#f2f2f2", "fill-opacity": { "base": 1, "stops": [[13, 0], [15, 1]] } }
    },
    {
      "id": "tunnel_motorway_casing",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 6,
      "filter": ["all", ["==", "class", "motorway"], ["==", "brunnel", "tunnel"]],
      "layout": { "line-cap": "butt" },
      "paint": {
        "line-color": "#fc8",
        "line-dasharray": [0.5, 0.25],
        "line-width": { "base": 1.4, "stops": [[6, 0.5], [20, 30]] }
      }
    },
    {
      "id": "tunnel_motorway_inner",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 6,
      "filter": ["all", ["==", "class", "motorway"], ["==", "brunnel", "tunnel"]],
      "paint": {
        "line-color": "hsl(0, 0%, 85%)",
        "line-width": { "base": 1.4, "stops": [[6, 0.5], [20, 20]] }
      }
    },
    {
      "id": "bridge_motorway_casing",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 6,
      "filter": ["all", ["==", "class", "motorway"], ["==", "brunnel", "bridge"]],
      "layout": { "line-cap": "butt" },
      "paint": {
        "line-color": "#fc8",
        "line-dasharray": [0.5, 0.25],
        "line-width": { "base": 1.4, "stops": [[6, 0.5], [20, 30]] }
      }
    },
    {
      "id": "bridge_motorway_inner",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 6,
      "filter": ["all", ["==", "class", "motorway"], ["==", "brunnel", "bridge"]],
      "paint": {
        "line-color": "hsl(0, 0%, 85%)",
        "line-width": { "base": 1.4, "stops": [[6, 0.5], [20, 20]] }
      }
    },
    {
      "id": "highway_motorway_casing",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 6,
      "filter": ["all", ["==", "class", "motorway"], ["!=", "brunnel", "bridge"], ["!=", "brunnel", "tunnel"]],
      "layout": { "line-cap": "butt" },
      "paint": {
        "line-color": "#fc8",
        "line-width": { "base": 1.4, "stops": [[6, 0.5], [20, 30]] }
      }
    },
    {
      "id": "highway_motorway_inner",
      "type": "line",
      "source": "openmaptiles",
      "source-layer": "transportation",
      "minzoom": 6,
      "filter": ["all", ["==", "class", "motorway"], ["!=", "brunnel", "bridge"], ["!=", "brunnel", "tunnel"]],
      "paint": {
        "line-color": "hsl(0, 0%, 85%)",
        "line-width": { "base": 1.4, "stops": [[6, 0.5], [20, 20]] }
      }
    }
  ]
}
