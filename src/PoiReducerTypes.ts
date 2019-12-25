import { Action } from 'redux';

export const ADD_POI = 'ADD_POI'
export const REMOVE_POI = 'REMOVE_POI'
export const SELECT_POI = 'SELECT_POI'
export const EDIT_POI = 'EDIT_POI'
export const UPDATE_POI = 'UPDATE_POI'

export interface Poi {
  ref: number;
  lngLat: mapboxgl.LngLat;
  symbol: string;
  symbolSize: number;
  title: string;
  desc: string;
  photoUrl: string;
}

export interface PoiState {
  poiList: Poi[],
  selectedPoi: number,
  editedPoi: number,
}

interface AddPoiAction extends Action {
  type: typeof ADD_POI;
  poi: Poi;
}

interface RemovePoiAction extends Action{
  type: typeof REMOVE_POI;
  ref: number;
}

interface SelectPoiAction extends Action{
  type: typeof SELECT_POI;
  ref: number;
}

interface EditPoiAction extends Action{
  type: typeof EDIT_POI;
  ref: number;
}

interface UpdatePoiAction extends Action{
  type: typeof UPDATE_POI;
  poi: Poi;
}

export type PoiActionTypes = AddPoiAction | RemovePoiAction | SelectPoiAction | EditPoiAction | UpdatePoiAction;
