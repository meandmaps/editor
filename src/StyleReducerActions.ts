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

import { SELECT_STYLE, STYLE_LOADED, SELECT_MARKER, OPEN_MENU, CLOSE_MENU, CLEAR_STYLE, StyleActionTypes } from './StyleReducerTypes';

export function selectStyle(style_url: string): StyleActionTypes {
    return {
        type: SELECT_STYLE,
        styleUrl: style_url
    }
}

export function styleLoaded(styleName: string, sprite: any, imageUrl: string): StyleActionTypes {
    return {
        type: STYLE_LOADED,
        styleName: styleName,
        sprite: sprite,
        imageUrl: imageUrl
    }
}

export function selectMarker(marker: string): StyleActionTypes {
    return {
        type: SELECT_MARKER,
        marker: marker
    }
}

export function openMenu(): StyleActionTypes {
    return {
        type: OPEN_MENU,
    }
}

export function closeMenu(): StyleActionTypes {
    return {
        type: CLOSE_MENU,
    }
}

export function clearStyle(): StyleActionTypes {
    return {
        type: CLEAR_STYLE,
    }
}
