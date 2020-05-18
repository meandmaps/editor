/* MIT License

Copyright (c) 2019 Benoit Baudaux

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

import { Action } from 'redux';

export const ADD_POI = 'ADD_POI'
export const REMOVE_POI = 'REMOVE_POI'
export const SELECT_POI = 'SELECT_POI'
export const EDIT_POI = 'EDIT_POI'
export const UPDATE_POI = 'UPDATE_POI'
export const MOVE_POI = 'MOVE_POI'
export const CLEAR_POI = 'CLEAR_POI'

export interface PoiMetadata {
  lang: string;
  title: string;
  desc: string;
  link: string;
  linkLabel: string;
}

export interface Photo {
  url: string;
  width: number;
  height: number;
}

export interface Poi {
  ref: number;
  lngLat: mapboxgl.LngLat;
  symbol: string;
  symbolSize: number;
  metadata: Array<PoiMetadata>;
  photos: Array<Photo>;
}

export interface PoiState {
  poiList: Poi[],
  selectedPoi: number,
  editedPoi: number,
  lastUpdate: number,
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

interface MovePoiAction extends Action{
  type: typeof MOVE_POI;
  ref: number;
  lngLat: mapboxgl.LngLat;
}

interface ClearPoiAction extends Action{
  type: typeof CLEAR_POI;
}

export type PoiActionTypes = AddPoiAction | RemovePoiAction | SelectPoiAction | EditPoiAction | UpdatePoiAction | MovePoiAction | ClearPoiAction;
