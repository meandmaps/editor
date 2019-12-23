import { symbol } from "prop-types";

export default class Poi {

    private ref: number;
    private lngLat: mapboxgl.LngLat;
    private symbol: string;
    private symbolSize: number;
    private title: string;
    private desc: string;
    private photoUrl: string;

    constructor(ref: number, lngLat: mapboxgl.LngLat, symbol: string) {

        this.ref = ref;
        this.lngLat = lngLat;
        this.symbol = symbol;
        this.symbolSize = 0.5;
        this.title = "Unamed poi";
        this.desc = "";
        this.photoUrl = "";
    }

    getLngLat(): mapboxgl.LngLat {

        return this.lngLat;
    }

    getSymbol(): string {

        return this.symbol;
    }

    getSymbolSize(): number {

        return this.symbolSize;
    }

    getRef(): number {

        return this.ref;
    }

    getTitle(): string {

        return this.title;
    }

    setTitle(t: string) {

        this.title = t;
    }

    getDesc(): string {

        return this.desc;
    }

    setDesc(d: string) {

        this.desc = d;
    }

    getPhotoUrl(): string {

        return this.photoUrl;
    }
}