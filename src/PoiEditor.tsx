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

import mapboxgl from 'mapbox-gl';

import './PoiEditor.css';

import Markers from './Markers';

import { Poi, PoiMetadata } from './PoiReducerTypes';
import { RootState } from './RootReducer';
import { editPoi, updatePoi, removePoi } from './PoiReducerActions';
import { selectMarker } from './StyleReducerActions';
import { Sprite, Symbol } from './StyleReducerTypes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons'

interface IProps {

}

interface StateProps {
    poi: Poi|null,
    imageUrl: string;
    sprite: any;
    selectedMarker: string;
}

interface DispatchProps {
    editPoi: (ref: number) => void;
    updatePoi: (poi: Poi) => void;
    removePoi: (ref: number) => void;
    selectMarker: (key: string) => void;
}

interface IState {

    ref: number;
    metadata: PoiMetadata[];
    lon: string;
    lat: string;
    size: string;
    symbol: string;
    photoUrl: string;
    language: string;
    photoUrlShown: boolean;
    photoUrlInput: string;
    photoDimensions: any;
    symbolsOpened: boolean;
}

type Props = StateProps & DispatchProps & IProps;

function mapStateToProps(state: RootState, ownProps: IProps): StateProps {

    if (state.poi.editedPoi == -1) {

        return { poi: null, sprite: state.style.sprite, imageUrl: state.style.imageUrl, selectedMarker: state.style.selectedMarker, };
    }
    else {

        let poi = state.poi.poiList.find(poi => poi.ref == state.poi.editedPoi);

        if (poi != undefined) {      
            return { poi: poi, sprite: state.style.sprite, imageUrl: state.style.imageUrl, selectedMarker: state.style.selectedMarker, };
        }
        else {
            return { poi: null, sprite: state.style.sprite, imageUrl: state.style.imageUrl, selectedMarker: state.style.selectedMarker, };
        }
    }
}

const mapDispatchToProps = {

    editPoi,
    updatePoi,
    removePoi,
    selectMarker,
};

class PoiEditor extends React.Component <Props,IState> {

    private photoUrlUpdated: boolean;

    constructor(props: Props) {

        super(props);

        this.onOpenSymbols = this.onOpenSymbols.bind(this);
        this.onCloseSymbols = this.onCloseSymbols.bind(this);
        this.onApplySymbol = this.onApplySymbol.bind(this);
        this.onTitleChange = this.onTitleChange.bind(this);
        this.onDescChange = this.onDescChange.bind(this);
        this.onPhotoUrlChange = this.onPhotoUrlChange.bind(this);
        this.onLonChange = this.onLonChange.bind(this);
        this.onLatChange = this.onLatChange.bind(this);
        this.onSizeChange = this.onSizeChange.bind(this);
        this.onLangChange = this.onLangChange.bind(this);
        this.onOpenPhotoDialog = this.onOpenPhotoDialog.bind(this);
        this.onClosePhotoDialog = this.onClosePhotoDialog.bind(this);
        this.onImgLoad = this.onImgLoad.bind(this);

        this.onConfirm = this.onConfirm.bind(this);

        this.photoUrlUpdated = false;

        if (this.props.poi != null) {

            let metadata = this.props.poi.metadata;

            if ( (metadata == null) || (metadata.length == 0) )
                metadata = [ {lang:"fr", title:"Sans titre", desc:""} ];

            this.state = {
                ref: this.props.poi.ref,
                metadata: metadata,
                language: metadata[0].lang,
                lon: ""+this.props.poi.lngLat.lng,
                lat: ""+this.props.poi.lngLat.lat,
                size: ""+this.props.poi.symbolSize,
                symbol: this.props.poi.symbol,
                photoUrl: this.props.poi.photoUrl,
                photoUrlShown: false,
                photoUrlInput: "",
                photoDimensions: { width: 150, height: 100},
                symbolsOpened: false,
            };
        }
        else {

            const metadata = [ {lang:"fr", title:"Sans titre", desc:""} ];

            this.state = {
                ref: -1,
                metadata: metadata,
                language: metadata[0].lang,
                lon: "",
                lat: "",
                size: "",
                symbol: "",
                photoUrl: "",
                photoUrlShown: false,
                photoUrlInput: "",
                photoDimensions: { width: 150, height: 100},
                symbolsOpened: false,
            };
        }
    }

    onOpenSymbols() {

        this.props.selectMarker(this.state.symbol);

        this.setState({symbolsOpened:true});
    }

    onCloseSymbols() {

        this.setState({symbolsOpened:false});
    }

    onApplySymbol() {

        this.setState({symbol:this.props.selectedMarker});

        this.setState({symbolsOpened:false});
    }

    getSymbol(key: string): any {

        if (key.length == 0)
            return null;

        let symbol: Symbol;

        if (key in this.props.sprite) {

          symbol = this.props.sprite[key];
        }
        else {

          return null;
        }
    
        const xRatio = 30.0/symbol.width;
        const yRatio = 30.0/symbol.height;
    
        const ratio = (xRatio <= yRatio)?xRatio:yRatio;
    
        const topStyle: CSSProperties = {
    
            width: ''+(symbol.width*ratio)+'px',
            height: ''+(symbol.height*ratio)+'px',
            padding: '3px',
        };
    
        const style: CSSProperties = {
    
            width: ''+symbol.width+'px',
            height: ''+symbol.height+'px',
            backgroundImage: "url('"+this.props.imageUrl+"')",
            backgroundPosition: ''+(-symbol.x)+'px '+(-symbol.y)+'px',
            transform: 'scale('+ratio+')',
            transformOrigin: '0 0'
        };
        
        return (<div className="PoiSymbol" style={topStyle} onClick={this.onOpenSymbols}><div style={style}></div></div>);
      }

    onTitleChange(event: any) {

        this.state.metadata!.find(e => e.lang === this.state.language)!.title = event.target.value;

        this.setState({metadata:this.state.metadata});
    }

    onDescChange(event: any) {

        this.state.metadata!.find(e => e.lang === this.state.language)!.desc = event.target.value;
        
        this.setState({metadata:this.state.metadata});
    }

    onPhotoUrlChange(event: any) {

        this.photoUrlUpdated = true;
        this.setState({photoUrlInput:event.target.value});
    }

    onLonChange(event: any) {

        this.setState({lon:event.target.value});
    }

    onLatChange(event: any) {

        this.setState({lat:event.target.value});
    }

    onSizeChange(event: any) {

        this.setState({size:event.target.value});
    }

    onConfirm(event: any) {

        this.props.updatePoi({
            ref: this.state.ref,
            metadata: this.state.metadata,
            lngLat: new mapboxgl.LngLat(parseFloat(this.state.lon),parseFloat(this.state.lat)),
            symbolSize: parseFloat(this.state.size),
            symbol: this.state.symbol,
            photoUrl: this.state.photoUrl,
        });

        this.props.editPoi(-1);
    }

    componentDidUpdate() {

        if ( (this.props.poi != null) && (this.props.poi.ref != this.state.ref) ) {

            let metadata = this.props.poi.metadata;

            if ( (metadata == null) || (metadata.length == 0) )
                metadata = [ {lang:"fr", title:"Sans titre", desc:""} ];

            this.setState({
                ref: this.props.poi.ref,
                metadata: metadata,
                lon: ""+this.props.poi.lngLat.lng,
                lat: ""+this.props.poi.lngLat.lat,
                size: ""+this.props.poi.symbolSize,
                symbol: this.props.poi.symbol,
                photoUrl: this.props.poi.photoUrl,
            });
        }
    }

    onLangChange(event: any) {

        const lang = event.target.value;

        let metadata = this.state.metadata;

        if (metadata!.find(e => e.lang === lang) == null) {

            metadata.push({ lang:lang, title:"", desc: ""});
        }

        this.setState({

            language: lang,
            metadata: metadata,
        });
    }

    onImgLoad(event: any) {

        console.log(event.target.naturalHeight);
        console.log(event.target.naturalWidth);

        if (event.target.naturalHeight < event.target.naturalWidth) {

            this.setState({
                photoDimensions: { width: 150, height: (150*event.target.naturalHeight)/event.target.naturalWidth},
            });
        }
        else {

            this.setState({
                photoDimensions: { width: (100*event.target.naturalWidth)/event.target.naturalHeight, height: 100},
            });
        }
    }

    onOpenPhotoDialog(event: any) {

        if (this.state.photoUrlShown) {

            this.setState({photoUrlShown: false, photoUrl:this.state.photoUrlInput});
        }
        else {
            this.photoUrlUpdated = false;
            this.setState({photoUrlShown: true, photoUrlInput:this.state.photoUrl});
        }
    }

    onClosePhotoDialog(event: any) {

        if (this.photoUrlUpdated) {

            this.setState({photoUrlShown: false, photoUrl:this.state.photoUrlInput});
        }
    }

    render() {

        if (this.props.poi != null) {

            if (this.state.symbolsOpened) {

                return (
                    <div className="PoiEditor">
                        <div>

                            <FontAwesomeIcon id="back" icon={faLongArrowAltLeft} onClick={this.onCloseSymbols} />
                            <Markers height={300} />
                            <button onClick={this.onApplySymbol}>Apply</button>
                        </div>
                    </div>
                );
            }
            else {
            
                return (
                    <div className="PoiEditor">
                        <div>
                            {this.getSymbol(this.state.symbol)}
                            <input className="PoiTitle" placeholder="title" value={this.state.metadata!.find(e => e.lang === this.state.language)!.title} onChange={this.onTitleChange}></input>
                            <select name="languages" className="PoiLanguage" onChange={this.onLangChange} value={this.state.language}>
                                <option value="fr">fr</option>
                                <option value="en">en</option>
                                <option value="de">de</option>
                                <option value="es">es</option>
                                <option value="it">it</option>
                                <option value="ch">ch</option>
                                <option value="jp">jp</option>
                            </select> 
                            <textarea className="PoiDesc" placeholder="add a description here"  value={this.state.metadata!.find(e => e.lang === this.state.language)!.desc} onChange={this.onDescChange}></textarea>
                            <div className="PoiProp" ><div>lon</div><input placeholder="lon" value={this.state.lon} onChange={this.onLonChange}></input></div>
                            <div className="PoiProp" ><div>lat</div><input placeholder="lat" value={this.state.lat} onChange={this.onLatChange}></input></div>
                            <div className="PoiProp" ><div>size</div><input placeholder="size" value={this.state.size} onChange={this.onSizeChange}></input></div>
                            <div style={{width: 200}}></div>
                            <img className="PhotoProp" style={this.state.photoDimensions} onClick={this.onOpenPhotoDialog} onLoad={this.onImgLoad} src={this.state.photoUrl} title="Click here for adding a picture" alt="Click here for adding a picture"></img>
                            <input id="photoUrlInput" className={(this.state.photoUrlShown == true) ? 'inputShown' : 'inputHidden'} onClick={this.onClosePhotoDialog} value={this.state.photoUrlInput} onChange={this.onPhotoUrlChange}></input>
                            <button onClick={this.onConfirm}>Done</button>
                            <FontAwesomeIcon id="removePoi" icon={faTrash} onClick={(e) => {this.props.removePoi(this.props.poi!.ref); this.props.editPoi(-1); }} />
                        </div>
                    </div>
                );
            }
        }
        else {

            return null;
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PoiEditor)
