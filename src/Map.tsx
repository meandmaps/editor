import React from 'react';
import mapboxgl from 'mapbox-gl';
import './mapbox-gl.css'
import './Map.css'
import { threadId } from 'worker_threads';
import Poi from './Poi';

interface IProps {
  
    styleUrl: string;
    mapLoaded: any;
    poiAdded: any;
    marker: string;
    poiList: Poi[];
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
        this.geojsonData = {
            type: 'FeatureCollection',
            features: []

        };
    }

    addPoi() {

        if (this.mapMouseEvent != null) {

            const poi: Poi = new Poi(Date.now(),this.mapMouseEvent.lngLat,this.props.marker);

            const feature = {

                'type': 'Feature',
                'geometry': {
                    'type': 'Point',
                    'coordinates': [poi.getLngLat().lng,poi.getLngLat().lat]
                },
                'properties': {
                    'icon': poi.getSymbol(),
                    'icon-size': poi.getSymbolSize(),
                    'ref': poi.getRef()
                }
            };

            this.geojsonData.features.push(feature);

            console.log(JSON.stringify(this.geojsonData));

            this.updateMarkers();

            this.props.poiAdded(poi);
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

                        

                        this.map.addSource('markers', { type: 'geojson', data: this.geojsonData });

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

                this.map.on('click', 'markers', function (e: any) {

                    if (e) {
                        
                        console.log('click on POI '+e.features[0].properties.ref);
                    }
                });

                // Change the cursor to a pointer when the mouse is over the places layer.
                this.map.on('mouseenter', 'markers', (e: mapboxgl.MapMouseEvent) => {

                    e.target.getCanvas().style.cursor = 'pointer';
                });
                
                // Change it back to a pointer when it leaves.
                this.map.on('mouseleave', 'markers', (e: mapboxgl.MapMouseEvent) => {

                    e.target.getCanvas().style.cursor = '';
                });

            }
        }
    }

    componentDidMount() {

        this.loadMap();
    }

    removeDeletedPoi() {

        for (let i = 0;i<this.geojsonData.features.length;i++) {

            let found = false;

            for (let poi of this.props.poiList) {

                if (this.geojsonData.features[i].properties.ref == poi.getRef())
                    found = true;
            }

            if (!found) {
                this.geojsonData.features.splice(i, 1);
                this.updateMarkers();
            } 
        }
    }

    componentDidUpdate() {

        this.loadMap();

        this.removeDeletedPoi();
    }
        
    render() {
        return (
            <div id="map" className="Map"></div>
        );
    }
}