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

export const SELECT_STYLE = 'SELECT_STYLE'
export const STYLE_LOADED = 'STYLE_LOADED'
export const SELECT_MARKER = 'SELECT_MARKER'
export const OPEN_MENU = 'OPEN_MENU'
export const CLOSE_MENU = 'CLOSE_MENU'
export const CLEAR_STYLE = 'CLEAR_STYLE'

export enum LoadingState {
    NONE = 0,
    LOADING,
    LOADED,
    ERROR
}

export interface StyleState {
    styleUrl: string;
    loadingState: LoadingState;
    styleName: string;
    sprite: any;
    imageUrl: string;
    selectedMarker: string;
    menuOpened: boolean;
}

interface SelectStyleAction extends Action {
    type: typeof SELECT_STYLE;
    styleUrl: string;
}

interface StyleLoadedAction extends Action {
    type: typeof STYLE_LOADED;
    styleName: string;
    sprite: any;
    imageUrl: string;
}

interface SelectMarkerAction extends Action {
    type: typeof SELECT_MARKER;
    marker: string;
}

interface OpenMenuAction extends Action {
    type: typeof OPEN_MENU;
}

interface CloseMenuAction extends Action {
    type: typeof CLOSE_MENU;
}

interface ClearStyleAction extends Action {
    type: typeof CLEAR_STYLE;
}

export type StyleActionTypes = SelectStyleAction | StyleLoadedAction | SelectMarkerAction | OpenMenuAction | CloseMenuAction | ClearStyleAction;
