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

import React from 'react';
import * as Redux from 'redux'
import { connect } from 'react-redux'

import mapboxgl from 'mapbox-gl';
import './mapbox-gl.css'
import './Map.css'

import { Poi, PoiActionTypes } from './PoiReducerTypes';
import { addPoi, selectPoi } from './PoiReducerActions';
import { styleLoaded } from './StyleReducerActions';
import { RootState } from './RootReducer';

interface IProps {
    
}

interface StateProps {
    poiList: Poi[];
    styleUrl: string;
    selectedMarker: string;
}
       
interface DispatchProps {
    addPoi: (newPoi: Poi) => void,
    selectPoi: (ref: number) => void,
    styleLoaded: (styleName: string, sprite: any, imageUrl: string) => void,
}

interface IState {

}

type Props = StateProps & DispatchProps & IProps;

function mapStateToProps(state: RootState, ownProps: IProps): StateProps {

    return { poiList: state.poi.poiList, styleUrl: state.style.styleUrl, selectedMarker: state.style.selectedMarker };
}

const mapDispatchToProps = {
    
    addPoi,
    selectPoi,
    styleLoaded,
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

            const metadata = [ {lang:"fr", title:"Sans titre", desc:""} ];

            const poi: Poi = {
                ref:Date.now(),
                metadata: metadata,
                photoUrl: "",
                lngLat: this.mapMouseEvent.lngLat,
                symbol: this.props.selectedMarker,
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
                            'metadata': poi.metadata,
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

            let index = this.props.styleUrl.indexOf("access_token");

            if ( index >= 0) {

                mapboxgl.accessToken = this.props.styleUrl.substring(index+13);

                console.log(mapboxgl.accessToken);
            }
            else {

                mapboxgl.accessToken = "";
            }

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

                        let spriteJsonUrl: string = this.map.getStyle().sprite + "@2x.json" || '';
                        let spritePngUrl: string = this.map.getStyle().sprite + "@2x.png" || '';

                        fetch(spriteJsonUrl)
                            .then(res => res.json())
                            .then(
                                (result) => {

                                    this.props.styleLoaded(mapName,result,spritePngUrl);
                                },
                                // Note: it's important to handle errors here
                                // instead of a catch() block so that we don't swallow
                                // exceptions from actual bugs in components.
                                (error) => {
                                    
                                    spriteJsonUrl = this.map!.getStyle().sprite + ".json" || '';
                                    spritePngUrl = this.map!.getStyle().sprite + ".png" || '';

                                    fetch(spriteJsonUrl)
                                        .then(res => res.json())
                                        .then(
                                            (result) => {

                                                this.props.styleLoaded(mapName,result,spritePngUrl);
                                            },
                                            // Note: it's important to handle errors here
                                            // instead of a catch() block so that we don't swallow
                                            // exceptions from actual bugs in components.
                                            (error) => {
                                                
                                                console.log(error);
                                            }
                                        );
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

                    // I don not know why it is a string, then we have to parse it
                    let metadata = JSON.parse(e.features[0].properties.metadata);

                    e.target.getCanvas().style.cursor = 'pointer';

                    this.popup
                        .setLngLat(e.features[0].geometry.coordinates)
                        .setHTML('<span>'+metadata[0].title+'</span>')
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