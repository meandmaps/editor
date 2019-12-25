import React from 'react';
import * as Redux from 'redux'
import { connect } from 'react-redux'

import mapboxgl from 'mapbox-gl';
import './mapbox-gl.css'
import './Map.css'

import { Poi, PoiActionTypes } from './PoiReducerTypes';
import { addPoi, selectPoi } from './PoiReducerActions';
import { FeatureCollection, Geometry } from 'geojson';
import { RootState } from './RootReducer';

interface IProps {
    
    styleUrl: string;
    mapLoaded: any;
    marker: string;
}

interface StateProps {
    poiList: Poi[]
}
       
interface DispatchProps {
    addPoi: (newPoi: Poi) => void,
    selectPoi: (ref: number) => void,
}

interface IState {

}

type Props = StateProps & DispatchProps & IProps;

function mapStateToProps(state: RootState, ownProps: IProps): StateProps {

    return { poiList: state.poi.poiList };
}

const mapDispatchToProps = {
    
    addPoi,
    selectPoi
};

class Map extends React.Component <Props,IState> {

    private map: mapboxgl.Map | null = null;

    private currentStyleUrl: string;

    private ADD_MARKER_TIMEOUT: number = 1000;
    private timerId: number;
    private mapMouseEvent: mapboxgl.MapMouseEvent|null;

    private popup: mapboxgl.Popup;

    constructor(props: Props) {
        
        super(props);

        this.currentStyleUrl = '';
        this.timerId = 0;
        this.mapMouseEvent = null;

        this.state = {};

        this.popup = new mapboxgl.Popup({ closeButton: false, closeOnClick: false});
    }

    addPoi() {

        if (this.mapMouseEvent != null) {

            const poi: Poi = {
                ref:Date.now(),
                title: "Unamed Poi",
                desc: "",
                photoUrl: "",
                lngLat: this.mapMouseEvent.lngLat,
                symbol: this.props.marker,
                symbolSize: 0.5
            };

            this.props.addPoi(poi);
        }
    }

    updateMarkers() {

        if (this.map) {

            const source: mapboxgl.GeoJSONSource = this.map.getSource('markers') as mapboxgl.GeoJSONSource;

            if (source) {

                let geojsondata: any = {
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
                            'title': poi.title,
                        }
                    };
                    
                    geojsondata.features.push(feature);
                }
                
                source.setData(geojsondata);
            }
        }
    }

    clearMarkerTimeout() {

        if (this.timerId != null) {
            
            window.clearTimeout(this.timerId);
            this.timerId = 0;
        }
    }

    selectPoi(ref: number) {

        this.props.selectPoi(ref);
    }

    loadMap() {

        if (this.currentStyleUrl === this.props.styleUrl)
            return;

        this.currentStyleUrl = this.props.styleUrl;

        if (this.map) {

            this.map.remove();

            this.map = null;
        }

        if (this.props.styleUrl.length > 0) {

            this.map = new mapboxgl.Map({
                container: 'map',
                style: this.props.styleUrl,
                attributionControl: true,
                customAttribution: '<a href="https://www.meandmaps.com" target="_blank">© me & maps</a>'
            });
    
            if (this.map) {
    
                this.map.on('load', () => {
    
                    if (this.map) {
    
                        const mapName: string = this.map.getStyle().name || '';

                        const spriteJsonUrl: string = this.map.getStyle().sprite + "@2x.json" || '';

                        const spritePngUrl: string = this.map.getStyle().sprite + "@2x.png" || '';

                        fetch(spriteJsonUrl)
                            .then(res => res.json())
                            .then(
                                (result) => {

                                    this.props.mapLoaded(mapName,result,spritePngUrl);
                                },
                                // Note: it's important to handle errors here
                                // instead of a catch() block so that we don't swallow
                                // exceptions from actual bugs in components.
                                (error) => {
                                    console.log(error);
                                }
                            );

                        this.map.addSource('markers', { type: 'geojson', data: {
                                type: 'FeatureCollection',
                                features: []
                            }
                        });

                        this.map.addLayer({
                            'id': 'markers',
                            'type': 'symbol',
                            'source': 'markers',
                            'layout': {
                                'icon-image': ['get', 'icon'],
                                "icon-size": ['get', 'icon-size'],
                                "icon-allow-overlap": true
                            }
                        });
                    }
                    
                });

                this.map.on('mousedown', (e: mapboxgl.MapMouseEvent) => {

                    this.clearMarkerTimeout();

                    this.mapMouseEvent = e;
                    
                    this.timerId = window.setTimeout(() => {this.addPoi()},this.ADD_MARKER_TIMEOUT);
                });

                this.map.on('mouseup', (e: mapboxgl.MapMouseEvent) => {

                    this.clearMarkerTimeout();
                });

                this.map.on('mousemove', (e: mapboxgl.MapMouseEvent) => {
    
                    this.clearMarkerTimeout();
                });

                this.map.on('click', 'markers', (e: any) => {

                    if (e) {

                        this.selectPoi(e.features[0].properties.ref);
                        
                        //console.log('click on POI '+e.features[0].properties.ref);
                    }
                });

                // Change the cursor to a pointer when the mouse is over the places layer.
                this.map.on('mouseenter', 'markers', (e: any) => {

                    e.target.getCanvas().style.cursor = 'pointer';

                    this.popup
                        .setLngLat(e.features[0].geometry.coordinates)
                        .setHTML('<span>'+e.features[0].properties.title+'</span>')
                        .addTo(this.map!);
                });
                
                // Change it back to a pointer when it leaves.
                this.map.on('mouseleave', 'markers', (e: mapboxgl.MapMouseEvent) => {

                    e.target.getCanvas().style.cursor = '';

                    this.popup.remove();
                });

            }
        }
    }

    componentDidMount() {

        this.loadMap();

        this.updateMarkers();
    }

    componentDidUpdate() {

        this.loadMap();

        this.updateMarkers();
    }
        
    render() {
        return (
            <div id="map" className="Map"></div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Map)