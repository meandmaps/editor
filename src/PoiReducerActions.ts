import { Poi, ADD_POI, REMOVE_POI, SELECT_POI, EDIT_POI, UPDATE_POI, PoiActionTypes } from './PoiReducerTypes';

export function addPoi(newPoi: Poi): PoiActionTypes {
    return {
        type: ADD_POI,
        poi: newPoi
    }
}

export function removePoi(ref: number): PoiActionTypes {
    return {
        type: REMOVE_POI,
        ref: ref
    }
}

export function selectPoi(ref: number): PoiActionTypes {
    return {
        type: SELECT_POI,
        ref: ref
    }
}

export function editPoi(ref: number): PoiActionTypes {
    return {
        type: EDIT_POI,
        ref: ref
    }
}

export function updatePoi(poi: Poi): PoiActionTypes {
    return {
        type: UPDATE_POI,
        poi: poi
    }
}