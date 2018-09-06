import * as d3 from 'd3'
import * as three from 'three'
import {ZoomBehavior} from "d3";

interface Center {
    keido: number,
    ido: number
}

abstract class Map {
    public width: number = 500;
    public height: number = 500;
    public scale: number = 500;
    public center: Center = {
        keido: 137.6850225,
        ido: 38.258595
    };
    public topojsonURL: string = "https://github.com/dataofjapan/land/blob/master/japan.topojson";

    public projection: d3.GeoProjection;
    public geoPath: d3.GeoPath<SVGPathElement, any>;
    public svg: d3.Selection<Element, undefined, null, undefined>;

    protected constructor(svg: Element) {
        this.projection = d3.geoMercator()
            .center([this.center.keido, this.center.ido])
            .translate([this.width / 2, this.height / 2])
            .scale(this.scale);

        this.geoPath = d3.geoPath().projection(this.projection);
        this.svg = d3.select<Element, undefined>(svg);
        this.svg.attr("height", this.height).attr("width", this.width);
    }

    async fetchTopoJson() {
        return await fetch(this.topojsonURL)
            .then(function (topojson) {
                return topojson.json();
            })
            .catch(console.error);
    }

    async createMap() {
        const _self = this;
        return await this.fetchTopoJson()
            .then(function (topojson): d3.Selection<SVGPathElement, Object, Element, undefined> {
                return _self.svg.selectAll("path")
                    .data<Object>(topojson)
                    .enter()
                    .append<SVGPathElement>("path")
                    .attr("d", _self.geoPath)
                    .style("stroke", "#000")
                    .style("stroke-width", 1)
                    .style("fill", "#fff")
            })
    }

    drawMap() {
        const _self = this;
        this.createMap()
            .then(function (map: d3.Selection<SVGPathElement, Object, Element, undefined>) {
                //ズームの設定
                let zoom: ZoomBehavior<Element, Object> = d3.zoom()
                //ズーム操作が行われたとき
                    .on("zoom", function () {
                        //投影方法の設定を変えて
                        _self.projection.scale(_self.scale * d3.event.transform.k);
                        //dタグの座標を新しくする
                        map.attr('d', _self.geoPath);
                    });
                //SVGタグに上記の設定を適用
                _self.svg.call(()=>{}, zoom);

                //ドラッグ操作の設定
                let drag = d3.drag()
                //ドラッグ操作が行われたとき
                    .on("drag", function () {
                        //投影方法の設定を変えて
                        let tl = _self.projection.translate();
                        _self.projection.translate([tl[0] + d3.event.dx, tl[1] + d3.event.dy]);
                        //dタグの座標を新しくする
                        map.attr("d", _self.geoPath);
                    });
                //SVG上に描画された地図に上記の設定を適用
                map.call(()=>{}, drag);
            })
    }
}

class JapanMap extends Map {
    public constructor(props: HTMLElement) {
        super(props);
    }
}

const node = document.getElementById("map");

let map: JapanMap;
if (node === null) {
    console.error();
    throw new DOMException();
} else {
    map = new JapanMap(node);
}

map.drawMap();