import React from 'react';
import mapboxgl from 'mapbox-gl';
import './mapbox-gl.css'
import './Map.css'
import { threadId } from 'worker_threads';

interface IProps {
  
    styleUrl: string;
    mapLoaded: any;
    poiAdded: any;
    marker: string;
}

interface IState {
}

export default class Map extends React.Component <IProps,IState> {

    private map: mapboxgl.Map | null = null;

    private currentStyleUrl: string;

    private ADD_MARKER_TIMEOUT: number = 1000;
    private timerId: number;
    private mapMouseEvent: mapboxgl.MapMouseEvent|null;

    private geojsonData: any;

    constructor(props: IProps) {
        
        super(props);

        this.currentStyleUrl = '';
        this.timerId = 0;
        this.mapMouseEvent = null;
    }

    addPoi() {

        if (this.mapMouseEvent != null) {

            this.props.poiAdded(this.mapMouseEvent.lngLat);

            const feature = {

                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [this.mapMouseEvent.lngLat.lng,this.mapMouseEvent.lngLat.lat]
                },
                'properties': {
                    'icon': this.props.marker
                }
            };

            this.geojsonData.features.push(feature);

            console.log(JSON.stringify(this.geojsonData));

            this.updateMarkers();
        }
    }

    updateMarkers() {
        
        const source: mapboxgl.GeoJSONSource = this.map!.getSource('markers') as mapboxgl.GeoJSONSource;
        
        if (source) {
            source.setData(this.geojsonData);
        }
    }

    clearMarkerTimeout() {

        if (this.timerId != null) {
            
            window.clearTimeout(this.timerId);
            this.timerId = 0;
        }
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
                customAttribution: '<a href="https://toktuko.herokuapp.com" target="_blank">© Toktuko</a>'
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

                        this.geojsonData = {

                            type: 'FeatureCollection',
                            features: []

                        };

                        this.map.addSource('markers', { type: 'geojson', data: this.geojsonData });

                        this.map.addLayer({
                            'id': 'markers',
                            'type': 'symbol',
                            'source': 'markers',
                            'layout': {
                                // get the icon name from the source's "icon" property
                                'icon-image': ['get', 'icon'],
                                "icon-size": 0.5,
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

            }
        }
    }

    componentDidMount() {

        this.loadMap();
    }

    componentDidUpdate() {

        this.loadMap();
    }
        
    render() {
        return (
            <div id="map" className="Map"></div>
        );
    }
}