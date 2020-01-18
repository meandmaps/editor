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

import React, { CSSProperties } from 'react';
import { connect } from 'react-redux'

import { Poi } from './PoiReducerTypes';

import { RootState } from './RootReducer';
import { clearStyle, closeMenu } from './StyleReducerActions';
import { clearPoi } from './PoiReducerActions';

import './Menu.css';

interface IProps {

}

interface StateProps {

    poiList: Poi[];
    styleName: string;
    menuOpened: boolean;
}

interface DispatchProps {

    closeMenu: () => void,
    clearStyle: () => void,
    clearPoi: () => void,
}

interface IState {

}

type Props = StateProps & DispatchProps & IProps;

function mapStateToProps(state: RootState, ownProps: IProps): StateProps {

    return {
        poiList: state.poi.poiList,
        styleName: state.style.styleName,
        menuOpened: state.style.menuOpened,
    };
}

const mapDispatchToProps = {
  
    closeMenu,
    clearStyle,
    clearPoi,
  };
  
class Menu extends React.Component <Props,IState> {

  constructor(props: Props) {

    super(props);

    this.onClose = this.onClose.bind(this);
    this.onNew = this.onNew.bind(this);
    this.onExport = this.onExport.bind(this);
  }

  componentDidUpdate() {
      
  }

  onClose() {

    this.props.closeMenu();
  }

  onNew() {

    this.props.clearStyle();
    this.props.clearPoi();
  }

  onExport() {

    let geojson: any = {
        type: 'FeatureCollection',
        features: new Array()
    };

    for (let poi of this.props.poiList) {

        let feature: any = {

            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [poi.lngLat.lng,poi.lngLat.lat]
            },
            'properties': {
                'icon': poi.symbol,
                'icon-size': poi.symbolSize,
                'ref': poi.ref,
                'photo': poi.photoUrl,
                'metadata': poi.metadata,
            }
        };
        
        geojson.features.push(feature);
    }
    
    this.download(this.props.styleName+' POI.geojson',JSON.stringify(geojson));
  }

  download(filename: string, filecontent: string) {
    
    let element = document.createElement('a');

    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(filecontent));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }

  render() {

    if (this.props.menuOpened == false)
        return null;

    return (
      <div className="Menu" onClick={this.onClose}>
        <div >
            <ul className="MenuList">
                <li className="MenuItem" onClick={this.onExport}>Export Geojson</li>
                <li className="MenuItem" onClick={this.onNew}>New</li>
            </ul>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps,mapDispatchToProps)(Menu)