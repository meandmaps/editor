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

import { Reducer } from 'redux'

import {
  PoiState,
  PoiActionTypes,
  ADD_POI,
  REMOVE_POI,
  SELECT_POI,
  EDIT_POI,
  UPDATE_POI,
  CLEAR_POI,
} from './PoiReducerTypes'

const initialState: PoiState = {
  poiList: [],
  selectedPoi: -1,
  editedPoi: -1,
  lastUpdate: -1,
}

export const poiReducer: Reducer<PoiState, PoiActionTypes> = (state: PoiState = initialState, action: PoiActionTypes) => {

  switch (action.type) {
    case ADD_POI:
      return {
        ...state,
        poiList: [...state.poiList, action.poi],
        lastUpdate: Date.now()
      }
    
    case REMOVE_POI:
      return {
        ...state,
        poiList: state.poiList.filter(
          poi => poi.ref !== action.ref
        ),
        lastUpdate: Date.now()
      }
    case SELECT_POI:
        return {
          ...state,
          selectedPoi: action.ref
        }
    case EDIT_POI:
        return {
          ...state,
          editedPoi: action.ref
        }
    case UPDATE_POI:
        return {
          ...state,
          poiList: [action.poi,...state.poiList.filter(
              poi => poi.ref !== action.poi.ref
            )],
          lastUpdate: Date.now()
        }
  case CLEAR_POI:
    return {
      ...state,
      poiList: [],
      editedPoi: -1,
      selectedPoi: -1,
      lastUpdate: -1,
    }
    default:
      return state
  }
}
