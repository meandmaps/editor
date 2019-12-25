import { Reducer } from 'redux'

import {
  PoiState,
  PoiActionTypes,
  ADD_POI,
  REMOVE_POI,
  SELECT_POI,
  EDIT_POI,
  UPDATE_POI,
} from './PoiReducerTypes'

const initialState: PoiState = {
  poiList: [],
  selectedPoi: -1,
  editedPoi: -1,
}

export const poiReducer: Reducer<PoiState, PoiActionTypes> = (state: PoiState = initialState, action: PoiActionTypes) => {

  switch (action.type) {
    case ADD_POI:
      return {
        ...state,
        poiList: [...state.poiList, action.poi]
      }
    
    case REMOVE_POI:
      return {
        ...state,
        poiList: state.poiList.filter(
          poi => poi.ref !== action.ref
        )
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
            )]
        }
    default:
      return state
  }
}
