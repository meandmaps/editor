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

import { Poi, ADD_POI, REMOVE_POI, SELECT_POI, EDIT_POI, UPDATE_POI, CLEAR_POI, PoiActionTypes } from './PoiReducerTypes';

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

export function clearPoi(): PoiActionTypes {
    return {
        type: CLEAR_POI,
    }
}