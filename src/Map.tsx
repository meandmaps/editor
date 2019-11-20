import React from 'react';
import mapboxgl from 'mapbox-gl';
import './mapbox-gl.css'
import './Map.css'
import { threadId } from 'worker_threads';

interface IProps {
  
    styleUrl: string;
    mapLoaded: any;
}

interface IState {

    openLoad: boolean;
    styleUrl: string;
}

export default class Map extends React.Component <IProps,IState> {

    private map: mapboxgl.Map | null = null;

    private currentStyleUrl: string;
    private startLongClick: number;

    constructor(props: IProps) {
        
        super(props);

        this.currentStyleUrl = '';
        this.startLongClick = 0;
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
                            )
                    }
                    
                });

                this.map.on('mousedown', (e: mapboxgl.MapMouseEvent) => {
                    
                    this.startLongClick = Date.now();
                    
                });

                this.map.on('mouseup', (e: mapboxgl.MapMouseEvent) => {

                    if (this.startLongClick > 0 && (Date.now() - this.startLongClick) > 1000) {

                        console.log("Long click at "+e.lngLat);

                        let marker = new mapboxgl.Marker()
                            .setLngLat(e.lngLat)
                            .addTo(e.target);
                    }

                    this.startLongClick = 0;
                });

                this.map.on('mousemove', (e: mapboxgl.MapMouseEvent) => {
    
                    this.startLongClick = 0;
                    
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