import { createLayerComponent } from "@react-leaflet/core";
import * as L from "leaflet";

// 🔥 Import the plugin directly from your local file
import "../lib/leaflet-tilelayer-wmts";

export interface WMTSProps extends L.WMSOptions {
  url: string;
  layer: string;
  tilematrixSet: string;
  time?: string;
  format?: string;
}

// const createWMTSLayer = (props: WMTSProps, context: any) => {
//   const { url, ...options } = props;

//   // @ts-ignore - plugin is untyped
//   const instance = (L as any).tileLayer.wmts(url, options);
//   return { instance, context };
// };

const createWMTSLayer = (props: WMTSProps, context: any) => {
  const { url, layer, tilematrixSet, time, format, ...options } = props;

  // @ts-ignore
  const instance = (L as any).tileLayer.wmts(url, {
    ...options,
    layer,
    tilematrixSet,
    time,
    format,
    style: "", // Explicitly pass empty style parameter
  });
  return { instance, context };
};
export const WMTSTileLayer = createLayerComponent<L.TileLayer, WMTSProps>(
  createWMTSLayer
);
