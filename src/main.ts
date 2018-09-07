//import * as three from 'three'
import * as d3zoom from "d3-zoom";
import * as d3drag from "d3-drag";
import * as d3selection from "d3-selection";
import * as d3geo from "d3-geo";

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

    public projection: d3geo.GeoProjection;
    public geoPath: d3geo.GeoPath<SVGPathElement, any>;
    public svg: d3selection.Selection<Element, undefined, null, undefined>;

    protected constructor(svg: Element) {
        this.projection = d3geo.geoMercator()
            .center([this.center.keido, this.center.ido])
            .translate([this.width / 2, this.height / 2])
            .scale(this.scale);

        this.geoPath = d3geo.geoPath().projection(this.projection);
        this.svg = d3selection.select(svg);
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
            .then(function (topojson): d3selection.Selection<SVGPathElement, Object, Element, undefined> {
                return _self.svg.selectAll("path")
                    .data<Object>(topojson)
                    .enter()
                    .append<SVGPathElement>("path")
                    .attr("d", _self.geoPath)
                    .style("stroke", "#000")
                    .style("stroke-width", 1)
                    .style("fill", "#fff")
            });
    }

    drawMap() {
        const _self = this;
        this.createMap()
            .then(function (map: d3selection.Selection<SVGPathElement, Object, Element, undefined>) {
                //ズームの設定
                let zoom: d3zoom.ZoomBehavior<Element, Object> = d3zoom.zoom()
                //ズーム操作が行われたとき
                    .on("zoom", function () {
                        //投影方法の設定を変えて
                        _self.projection.scale(_self.scale * d3selection.event.transform.k);
                        //dタグの座標を新しくする
                        map.attr('d', _self.geoPath);
                    });
                //SVGタグに上記の設定を適用
                _self.svg.call(()=>{}, zoom);

                //ドラッグ操作の設定
                let drag = d3drag.drag()
                //ドラッグ操作が行われたとき
                    .on("drag", function () {
                        //投影方法の設定を変えて
                        let tl = _self.projection.translate();
                        _self.projection.translate([tl[0] + d3selection.event.dx, tl[1] + d3selection.event.dy]);
                        //dタグの座標を新しくする
                        map.attr("d", _self.geoPath);
                    });
                //SVG上に描画された地図に上記の設定を適用
                map.call(()=>{}, drag);
            });
    }
}

class JapanMap extends Map {
    public constructor(props: HTMLElement) {
        super(props);
    }
}

const node = document.getElementById("map");
console.log(node);
let map: JapanMap;
if (node === null) {
    console.error("#map not found.");
} else {
    map = new JapanMap(node);
    map.drawMap();
}