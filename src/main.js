"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
//import * as three from 'three'
var d3zoom = __importStar(require("d3-zoom"));
var d3drag = __importStar(require("d3-drag"));
var d3selection = __importStar(require("d3-selection"));
var d3geo = __importStar(require("d3-geo"));
var Map = /** @class */ (function () {
    function Map(svg) {
        this.width = 500;
        this.height = 500;
        this.scale = 500;
        this.center = {
            keido: 137.6850225,
            ido: 38.258595
        };
        this.topojsonURL = "https://github.com/dataofjapan/land/blob/master/japan.topojson";
        this.projection = d3geo.geoMercator()
            .center([this.center.keido, this.center.ido])
            .translate([this.width / 2, this.height / 2])
            .scale(this.scale);
        this.geoPath = d3geo.geoPath().projection(this.projection);
        this.svg = d3selection.select(svg);
        this.svg.attr("height", this.height).attr("width", this.width);
    }
    Map.prototype.fetchTopoJson = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, fetch(this.topojsonURL)
                            .then(function (topojson) {
                            return topojson.json();
                        })
                            .catch(console.error)];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Map.prototype.createMap = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _self;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _self = this;
                        return [4 /*yield*/, this.fetchTopoJson()
                                .then(function (topojson) {
                                return _self.svg.selectAll("path")
                                    .data(topojson)
                                    .enter()
                                    .append("path")
                                    .attr("d", _self.geoPath)
                                    .style("stroke", "#000")
                                    .style("stroke-width", 1)
                                    .style("fill", "#fff");
                            })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Map.prototype.drawMap = function () {
        var _self = this;
        this.createMap()
            .then(function (map) {
            //ズームの設定
            var zoom = d3zoom.zoom()
                //ズーム操作が行われたとき
                .on("zoom", function () {
                //投影方法の設定を変えて
                _self.projection.scale(_self.scale * d3selection.event.transform.k);
                //dタグの座標を新しくする
                map.attr('d', _self.geoPath);
            });
            //SVGタグに上記の設定を適用
            _self.svg.call(function () { }, zoom);
            //ドラッグ操作の設定
            var drag = d3drag.drag()
                //ドラッグ操作が行われたとき
                .on("drag", function () {
                //投影方法の設定を変えて
                var tl = _self.projection.translate();
                _self.projection.translate([tl[0] + d3selection.event.dx, tl[1] + d3selection.event.dy]);
                //dタグの座標を新しくする
                map.attr("d", _self.geoPath);
            });
            //SVG上に描画された地図に上記の設定を適用
            map.call(function () { }, drag);
        });
    };
    return Map;
}());
var JapanMap = /** @class */ (function (_super) {
    __extends(JapanMap, _super);
    function JapanMap(props) {
        return _super.call(this, props) || this;
    }
    return JapanMap;
}(Map));
var node = document.getElementById("map");
console.log(node);
var map;
if (node === null) {
    console.error("#map not found.");
}
else {
    map = new JapanMap(node);
    map.drawMap();
}
//# sourceMappingURL=main.js.map