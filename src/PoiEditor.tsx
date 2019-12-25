import React, { CSSProperties } from 'react';
import { connect } from 'react-redux'

import mapboxgl from 'mapbox-gl';

import './PoiEditor.css';

import { Poi } from './PoiReducerTypes';
import { RootState } from './RootReducer';
import { editPoi, updatePoi } from './PoiReducerActions';

interface IProps {

    imageUrl: string;
    sprite: any;
}

interface StateProps {
    poi: Poi|null
}
       
interface DispatchProps {
    editPoi: (ref: number) => void,
    updatePoi: (poi: Poi) => void,
}

interface IState {

    ref: number;
    title: string;
    desc: string;
    lon: number;
    lat: number;
    size: number;
    symbol: string;
    photoUrl: string;
}

type Props = StateProps & DispatchProps & IProps;

function mapStateToProps(state: RootState, ownProps: IProps): StateProps {

    if (state.poi.editedPoi == -1) {

        return { poi: null };
    }
    else {

        let poi = state.poi.poiList.find(poi => poi.ref == state.poi.editedPoi);

        if (poi != undefined) {      
            return { poi: poi };
        }
        else {
            return { poi: null };
        }
    }
}

const mapDispatchToProps = {

    editPoi,
    updatePoi
};

class PoiEditor extends React.Component <Props,IState> {

    constructor(props: Props) {

        super(props);

        this.onTitleChange = this.onTitleChange.bind(this);
        this.onDescChange = this.onDescChange.bind(this);
        this.onPhotoUrlChange = this.onPhotoUrlChange.bind(this);
        this.onLonChange = this.onLonChange.bind(this);
        this.onLatChange = this.onLatChange.bind(this);
        this.onSizeChange = this.onSizeChange.bind(this);

        this.onConfirm = this.onConfirm.bind(this);

        if (this.props.poi != null) {

            this.state = {
                ref: this.props.poi.ref,
                title: this.props.poi.title,
                desc: this.props.poi.desc,
                lon: this.props.poi.lngLat.lng,
                lat: this.props.poi.lngLat.lat,
                size: this.props.poi.symbolSize,
                symbol: this.props.poi.symbol,
                photoUrl: this.props.poi.photoUrl,
            };
        }
        else {

            this.state = {
                ref: -1,
                title: "",
                desc: "",
                lon: 0,
                lat: 0,
                size: 0,
                symbol: "",
                photoUrl: "",
            };
        }
    }

    getSymbol(key: string): any {

        if (key.length == 0)
            return null;
    
        const xRatio = 30.0/this.props.sprite[key].width;
        const yRatio = 30.0/this.props.sprite[key].height;
    
        const ratio = (xRatio <= yRatio)?xRatio:yRatio;
    
        const topStyle: CSSProperties = {
    
            width: ''+(this.props.sprite[key].width*ratio)+'px',
            height: ''+(this.props.sprite[key].height*ratio)+'px',
            padding: '3px',
        };
    
        const style: CSSProperties = {
    
            width: ''+this.props.sprite[key].width+'px',
            height: ''+this.props.sprite[key].height+'px',
            backgroundImage: "url('"+this.props.imageUrl+"')",
            backgroundPosition: ''+(-this.props.sprite[key].x)+'px '+(-this.props.sprite[key].y)+'px',
            transform: 'scale('+ratio+')',
            transformOrigin: '0 0'
        };
        
        return (<div className="PoiSymbol" style={topStyle}><div style={style}></div></div>);
      }

    onTitleChange(event: any) {

        this.setState({title:event.target.value});
    }

    onDescChange(event: any) {

        this.setState({desc:event.target.value});
    }

    onPhotoUrlChange(event: any) {

        this.setState({photoUrl:event.target.value});
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

        /*this.props.poi.setTitle(this.state.title);
        this.props.poi.setDesc(this.state.desc);*/

        this.props.updatePoi({
            ref: this.state.ref,
            title: this.state.title,
            desc: this.state.desc,
            lngLat: new mapboxgl.LngLat(this.state.lon,this.state.lat),
            symbolSize: this.state.size,
            symbol: this.state.symbol,
            photoUrl: this.state.photoUrl,
        });

        this.props.editPoi(-1);
    }

    componentDidUpdate() {

        if ( (this.props.poi != null) && (this.props.poi.ref != this.state.ref) ) {

            this.setState({
                ref: this.props.poi.ref,
                title: this.props.poi.title,
                desc: this.props.poi.desc,
                lon: this.props.poi.lngLat.lng,
                lat: this.props.poi.lngLat.lat,
                size: this.props.poi.symbolSize,
                symbol: this.props.poi.symbol,
                photoUrl: this.props.poi.photoUrl,
            });
        }
    }

    render() {

        if (this.props.poi != null) {
            
            return (
                <div className="PoiEditor">
                    <div>
                        {this.getSymbol(this.state.symbol)}
                        <input className="PoiTitle" placeholder="title" value={this.state.title} onChange={this.onTitleChange}></input>
                        <textarea className="PoiDesc" placeholder="add a description here"  value={this.state.desc} onChange={this.onDescChange}></textarea>
                        <div className="PoiPhoto" ><div>photo</div><input placeholder="photo url" value={this.state.photoUrl} onChange={this.onPhotoUrlChange}></input></div>
                        <div className="PoiProp" ><div>lon</div><input placeholder="lon" value={this.state.lon} onChange={this.onLonChange}></input></div>
                        <div className="PoiProp" ><div>lat</div><input placeholder="lat" value={this.state.lat} onChange={this.onLatChange}></input></div>
                        <div className="PoiProp" ><div>size</div><input placeholder="size" value={this.state.size} onChange={this.onSizeChange}></input></div>
                        <button onClick={this.onConfirm}>Done</button>
                    </div>
                </div>
            );
        }
        else {

            return null;
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PoiEditor)
