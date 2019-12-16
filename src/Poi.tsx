export default class Poi {

    private lngLat: mapboxgl.LngLat;
    private title: string;

    constructor(lngLat: mapboxgl.LngLat) {

        this.lngLat = lngLat;
        this.title = "untitled";
    }

    getTitle(): string {

        return this.title;
    }
}