import L from "leaflet";

L.TileLayer.WMTS = L.TileLayer.extend({
  defaultWmtsParams: {
    service: "WMTS",
    request: "GetTile",
    version: "1.0.0",
    layer: "",
    style: "",
    tilematrixSet: "",
    format: "image/jpeg",
  },

  initialize: function (url, options) {
    this._url = url;
    var wmtsParams = L.extend({}, this.defaultWmtsParams);

    options.tileSize = options.tileSize || 256;

    for (var i in options) {
      if (!(i in this.options)) {
        wmtsParams[i] = options[i];
      }
    }

    this.wmtsParams = wmtsParams;

    L.setOptions(this, options);
  },

  getTileUrl: function (coords) {
    var tileMatrix = this.options.tilematrixSet + ":" + this._getZoomForUrl();
    return (
      this._url +
      L.Util.getParamString(this.wmtsParams, this._url, true) +
      "&TILEMATRIX=" +
      tileMatrix +
      "&TILEROW=" +
      coords.y +
      "&TILECOL=" +
      coords.x
    );
  },

  setParams: function (params, noRedraw) {
    L.extend(this.wmtsParams, params);

    if (!noRedraw) {
      this.redraw();
    }

    return this;
  },
});

L.tileLayer.wmts = function (url, options) {
  return new L.TileLayer.WMTS(url, options);
};
