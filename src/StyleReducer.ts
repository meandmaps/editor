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
  StyleState,
  LoadingState,
  StyleActionTypes,
  SELECT_STYLE,
  SELECT_MARKER,
  STYLE_LOADED,
  OPEN_MENU,
  CLOSE_MENU,
  CLEAR_STYLE,
} from './StyleReducerTypes'

const initialState: StyleState = {
    styleUrl: "",
    loadingState: LoadingState.NONE,
    styleName: "",
    sprite: {},
    imageUrl: "",
    selectedMarker: "",
    menuOpened: false,
}

export const styleReducer: Reducer<StyleState, StyleActionTypes> = (state: StyleState = initialState, action: StyleActionTypes) => {

  switch (action.type) {
    case SELECT_STYLE:
        return {
            ...state,
            styleUrl: action.styleUrl,
            loadingState: LoadingState.LOADING,
            styleName: "",
            sprite: {},
            imageUrl: "",
            selectedMarker: "",
        }
    case STYLE_LOADED:
        return {
            ...state,
            loadingState: LoadingState.LOADED,
            styleName: action.styleName,
            sprite: action.sprite,
            imageUrl: action.imageUrl,
            selectedMarker: "",
        }
    case SELECT_MARKER:
        return {
            ...state,
            selectedMarker: action.marker,
        }
    case OPEN_MENU:
        return {
            ...state,
            menuOpened: true,
        }
    case CLOSE_MENU:
        return {
            ...state,
            menuOpened: false,
        }
    case CLEAR_STYLE:
        return {
            ...state,
            styleUrl: "",
            loadingState: LoadingState.NONE,
            styleName: "",
            sprite: {},
            imageUrl: "",
            menuOpened: false,
        }
    default:
      return state
  }
}
