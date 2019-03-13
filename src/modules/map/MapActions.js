/* Types */
export const SET_MAP_STATE = "SET_MAP_STATE";
export const SET_PROJECTION = "SET_PROJECTION";

export const SET_BASELAYER = "SET_BASELAYER";
export const ADD_BASELAYER = "ADD_BASELAYER";
export const REMOVE_BASELAYER = "REMOVE_BASELAYER";

export const SHOW_OVERLAY = "SHOW_OVERLAY";
export const HIDE_OVERLAY = "HIDE_OVERLAY";
export const ADD_OVERLAY = "ADD_OVERLAY";
export const REMOVE_OVERLAY = "REMOVE_OVERLAY";

export const SET_CENTER = "SET_CENTER";
export const SET_ZOOM = "SET_ZOOM";
export const SET_BOUNDS = "SET_BOUNDS";
export const SET_VIEWPORT = "SET_VIEWPORT";

export const SET_PANNABLE = "SET_PANNABLE";
export const SET_TIMELINE_VISIBILITY = "SET_TIMELINE_VISIBILITY";
export const TOGGLE_TIMELINE_VISIBILITY = "TOGGLE_TIMELINE_VISIBILITY";

/* Actions */
export const setProjection = projection => ({
  type: SET_PROJECTION,
  projection
});

export const setBaselayer = layer => ({ type: SET_BASELAYER, layer });
export const addBaselayer = layer => ({ type: ADD_BASELAYER, layer });
export const removeBaselayer = layer => ({ type: REMOVE_BASELAYER, layer });

export const setCenter = center => ({ type: SET_CENTER, center });
export const setZoom = zoom => ({ type: SET_ZOOM, zoom });
export const setBounds = bounds => ({ type: SET_BOUNDS, bounds });
export const setViewport = ({ center, zoom, bounds }) => ({
  type: SET_VIEWPORT,
  center,
  zoom,
  bounds
});

export const showOverlay = layer => ({ type: SHOW_OVERLAY, layer });
export const hideOverlay = layer => ({ type: HIDE_OVERLAY, layer });
export const addOverlay = layer => ({ type: ADD_OVERLAY, layer });
export const removeOverlay = layer => ({ type: REMOVE_OVERLAY, layer });
export const setMapState = state => ({ type: SET_MAP_STATE, state });

export const setPannable = pannable => ({ type: SET_PANNABLE, pannable });
export const enablePanning = () => ({ type: SET_PANNABLE, pannable: true });
export const disablePanning = () => ({ type: SET_PANNABLE, pannable: false });

export const setTimelineVisibility = visible => ({
  type: SET_TIMELINE_VISIBILITY,
  visible
});
export const toggleTimeline = () => ({ type: TOGGLE_TIMELINE_VISIBILITY });
export const showTimeline = () => ({
  type: SET_TIMELINE_VISIBILITY,
  visible: true
});
export const hideTimeline = () => ({
  type: SET_TIMELINE_VISIBILITY,
  visible: false
});
