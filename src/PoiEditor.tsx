import React, { CSSProperties } from 'react';
import './PoiEditor.css';

import Poi from './Poi';

interface IProps {

    poi: Poi;
    editDone: any;
    imageUrl: string;
    sprite: any;
}

interface IState {

    title: string;
    desc: string;
    lon: number;
    lat: number;
    size: number;
    symbol: string;
    photoUrl: string;
}

export default class PoiEditor extends React.Component <IProps,IState> {

    constructor(props: IProps) {

        super(props);

        this.onTitleChange = this.onTitleChange.bind(this);
        this.onDescChange = this.onDescChange.bind(this);
        this.onPhotoUrlChange = this.onPhotoUrlChange.bind(this);
        this.onLonChange = this.onLonChange.bind(this);
        this.onLatChange = this.onLatChange.bind(this);
        this.onSizeChange = this.onSizeChange.bind(this);

        this.onConfirm = this.onConfirm.bind(this);

        this.state = {
            title: this.props.poi.getTitle(),
            desc: this.props.poi.getDesc(),
            lon: this.props.poi.getLngLat().lng,
            lat: this.props.poi.getLngLat().lat,
            size: this.props.poi.getSymbolSize(),
            symbol: this.props.poi.getSymbol(),
            photoUrl: this.props.poi.getPhotoUrl(),
        };
    }

    getSymbol(key: string): any {

        const marker: boolean = ("marker" in this.props.sprite[key]);
    
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

        this.props.poi.setTitle(this.state.title);
        this.props.poi.setDesc(this.state.desc);

        this.props.editDone();
    }

    render() {
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
}

