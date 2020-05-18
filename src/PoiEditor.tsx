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

import { Poi, PoiMetadata, Photo } from './PoiReducerTypes';
import { RootState } from './RootReducer';
import { editPoi, updatePoi, removePoi } from './PoiReducerActions';
import { selectMarker } from './StyleReducerActions';
import { Sprite, Symbol } from './StyleReducerTypes';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faLongArrowAltLeft, faCameraRetro, faTimes } from '@fortawesome/free-solid-svg-icons'

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
    photos: Array<Photo>;
    language: string;
    photoUrlShown: boolean;
    photoUrlInput: string;
    symbolsOpened: boolean;
    newLanguagesOpened: boolean;
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
        this.onSelectLanguage = this.onSelectLanguage.bind(this);
        this.onLinkChange = this.onLinkChange.bind(this);
        this.onLinkLabelChange = this.onLinkLabelChange.bind(this);
        this.onOpenClosePhotoDialog = this.onOpenClosePhotoDialog.bind(this);
        this.onImgLoad = this.onImgLoad.bind(this);
        this.onRemovePhoto = this.onRemovePhoto.bind(this);
        this.onToggleLanguages = this.onToggleLanguages.bind(this);
        this.closeNewLanguages = this.closeNewLanguages.bind(this);
        this.addLanguage = this.addLanguage.bind(this);
        this.onDelete = this.onDelete.bind(this);

        this.onConfirm = this.onConfirm.bind(this);

        this.photoUrlUpdated = false;

        if (this.props.poi != null) {

            let metadata = this.props.poi.metadata;

            if ( (metadata == null) || (metadata.length == 0) ) {
                metadata = [ {lang:"fr", title:"Sans titre", desc:"", link: "", linkLabel: ""} ];
            }

            let photos = this.props.poi.photos;

            if (photos == null)
                photos = [];

            this.state = {
                ref: this.props.poi.ref,
                metadata: metadata,
                language: metadata[0].lang,
                lon: ""+this.props.poi.lngLat.lng,
                lat: ""+this.props.poi.lngLat.lat,
                size: ""+this.props.poi.symbolSize,
                symbol: this.props.poi.symbol,
                photos: photos,
                photoUrlShown: false,
                photoUrlInput: "",
                symbolsOpened: false,
                newLanguagesOpened: false,
            };
        }
        else {

            const metadata = [ {lang:"fr", title:"Sans titre", desc:"", link: "", linkLabel: ""} ];

            this.state = {
                ref: -1,
                metadata: metadata,
                language: metadata[0].lang,
                lon: "",
                lat: "",
                size: "",
                symbol: "",
                photos: [],
                photoUrlShown: false,
                photoUrlInput: "",
                symbolsOpened: false,
                newLanguagesOpened: false,
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
            photos: this.state.photos,
        });

        this.props.editPoi(-1);
    }

    componentDidMount() {

        
    }

    componentDidUpdate() {

        if ( (this.props.poi != null) && (this.props.poi.ref != this.state.ref) ) {

            let metadata = this.props.poi.metadata;

            if ( (metadata == null) || (metadata.length == 0) )
                metadata = [ {lang:"fr", title:"Sans titre", desc:"", link: "", linkLabel: ""} ];

            let lang = this.state.language;

            if (!metadata.find(e => e.lang === this.state.language)) {

                lang = metadata[0].lang;
            }

            this.setState({
                ref: this.props.poi.ref,
                metadata: metadata,
                lon: ""+this.props.poi.lngLat.lng,
                lat: ""+this.props.poi.lngLat.lat,
                size: ""+this.props.poi.symbolSize,
                symbol: this.props.poi.symbol,
                photos: this.props.poi.photos,
                language: lang,
            });
        }
    }

    onSelectLanguage(lang: string) {

        this.setState({

            language: lang,
        });
    }

    onLinkChange(event: any) {

        this.state.metadata!.find(e => e.lang === this.state.language)!.link = event.target.value;
        
        this.setState({metadata:this.state.metadata});
    }

    onLinkLabelChange(event: any) {

        this.state.metadata!.find(e => e.lang === this.state.language)!.linkLabel = event.target.value;
        
        this.setState({metadata:this.state.metadata});
    }

    onImgLoad(event: any, photo: Photo) {

        photo.width = event.target.naturalWidth;
        photo.height = event.target.naturalHeight;

        if (event.target.naturalHeight < event.target.naturalWidth) {

            event.target.style.width = "100%";
            event.target.style.height = "unset";
        }
        else {

            event.target.style.height = "100%";
            event.target.style.width = "unset";
        }

        this.setState({photos: this.state.photos});
    }

    onOpenClosePhotoDialog(event: any) {

        if (this.state.photoUrlShown) {

            this.setState({photoUrlShown: false});

            if (this.state.photoUrlInput.length > 0) {

                this.setState({photos: [...this.state.photos,{url:this.state.photoUrlInput,width:-1,height:-1}]});
            }
        }
        else {
            this.photoUrlUpdated = false;
            
            this.setState({photoUrlShown: true, photoUrlInput:""});
        }
    }

    onRemovePhoto(event: any, photoIndex: number) {

        this.state.photos.splice(photoIndex-1,1);

        this.setState({photos: this.state.photos});
    }

    onDelete() {

        if (this.state.metadata.length == 1) {
            // Only one language: remove POI
            this.props.removePoi(this.props.poi!.ref);
            this.props.editPoi(-1);
        }
        else {
            // More than one language: remove current language

            let metadata = this.state.metadata.filter(m => { return (m.lang != this.state.language) });

            this.setState({
                metadata: metadata,
                language: metadata[0].lang,
            });
        }
    }

    renderPhotosVideos() {

        let photoIndex = 0;

        let li = this.state.photos.map((photo: Photo) => { photoIndex += 1; if ( (photo.url.indexOf("youtube") < 0) && (photo.url.indexOf("youtu.be") < 0) && (photo.url.indexOf("vimeo") < 0) && (photo.url.indexOf("dailymotion") < 0) ) { return (

                <li>
                    <img src={photo.url} onLoad={(function (_photo,_this) {

                                return function (event: any) {

                                    _this.onImgLoad(event,_photo);
                                }

                            }) (photo,this)}></img>

                    <FontAwesomeIcon icon={faTimes} className="PhotoTrash" onClick={(function (_photoIndex,_this) {

                                return function (event: any) {

                                    _this.onRemovePhoto(event,_photoIndex);
                                }

                            }) (photoIndex,this)}/>
                </li>
            );
            }
            else {

                return (

                    <li>
                        <iframe width="130" height="73" src={photo.url}></iframe>

                        <FontAwesomeIcon icon={faTimes} className="PhotoTrash" onClick={(function (_photoIndex,_this) {

                            return function (event: any) {

                                _this.onRemovePhoto(event,_photoIndex);
                            }

                        }) (photoIndex,this)}/>
                    </li>
                );
            }
        });

        li.unshift((<li style={{width:"70px",minWidth: "70px"}}><FontAwesomeIcon icon={faCameraRetro} style={{margin:"auto",fontSize:"40px"}} onClick={this.onOpenClosePhotoDialog}/><input id="photoUrlInput" className={(this.state.photoUrlShown == true) ? 'inputShown' : 'inputHidden'} value={this.state.photoUrlInput} onChange={this.onPhotoUrlChange} placeholder="Enter URL of photo or video"></input></li>));

        return li;
    }

    addLanguage(lang: string) {

        console.log('addLanguage:'+lang);

        let metadata = this.state.metadata;

        metadata.push({ lang:lang, title:"", desc: "", link: "", linkLabel: ""});

        this.setState({

            language: lang,
            metadata: metadata,
        });
    }

    renderNewLanguages() {

        if (this.state.newLanguagesOpened) {

            const newLanguages = ['fr','en','de','es','it','ch','jp'];

            return (<div id="NewLanguages">
                        {
                            newLanguages.filter(lang => !(this.state.metadata!.map(e => e.lang).includes(lang))).map(l => { return (<div onClick={ev => this.addLanguage(l)}>{l}</div>); })
                        }
                    </div>
                );
        }
    }

    renderLanguages() {

        return (    <div className="PoiLanguages">
                        {this.state.metadata!.map(e => {return (<div className={(this.state.language == e.lang) ? 'languageSelected' : ''} onClick={ev => this.onSelectLanguage(e.lang)}>{e.lang}</div>)})}
                        <button id="NewLanguage" onClick={this.onToggleLanguages}>add language{this.renderNewLanguages()}</button>
                        
                    </div>
                );
    }

    onToggleLanguages(e: any) {

        this.setState({newLanguagesOpened: !this.state.newLanguagesOpened});

        e.stopPropagation();
    }

    closeNewLanguages() {

        this.setState({newLanguagesOpened: false});
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
                        <div onClick={this.closeNewLanguages}>
                            {this.getSymbol(this.state.symbol)}{this.renderLanguages()}
                            <input className="PoiTitle" placeholder="title" value={this.state.metadata!.find(e => e.lang === this.state.language)!.title} onChange={this.onTitleChange} style={{marginLeft:"auto"}}></input>
                            <textarea className="PoiDesc" placeholder="add a description here"  value={this.state.metadata!.find(e => e.lang === this.state.language)!.desc} onChange={this.onDescChange}></textarea>
                            <div className="PoiProp"><span>link URL</span><input placeholder="link URL" style={{width:"250px"}} value={this.state.metadata!.find(e => e.lang === this.state.language)!.link || ""} onChange={this.onLinkChange}></input></div>
                            <div className="PoiProp" style={{marginLeft:"auto"}}><span>link label</span><input placeholder="link label" style={{width:"150px"}} value={this.state.metadata!.find(e => e.lang === this.state.language)!.linkLabel || ""} onChange={this.onLinkLabelChange}></input></div>
                            <div className="PoiProp" ><span>lon</span><input placeholder="lon" value={this.state.lon} onChange={this.onLonChange} style={{width:"80px"}}></input></div>
                            <div className="PoiProp" style={{marginLeft:"10px"}}><span>lat</span><input placeholder="lat" value={this.state.lat} onChange={this.onLatChange} style={{width:"80px"}}></input></div>
                            <div className="PoiProp" style={{marginLeft:"auto"}}><span>symbol size</span><input placeholder="size" value={this.state.size} onChange={this.onSizeChange} style={{width:"30px"}}></input></div>
                            <ul className="PhotoProp">
                            {this.renderPhotosVideos()}
                            </ul>
                            <button onClick={this.onConfirm}>Done</button>
                            <FontAwesomeIcon id="removePoi" icon={faTrash} onClick={this.onDelete} />
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
