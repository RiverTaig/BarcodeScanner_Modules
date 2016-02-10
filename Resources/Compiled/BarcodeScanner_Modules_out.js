
/* Begin Script: Resources/TSout/BarcodeScanner_Modules_ts_out.js ------------------------- */ 
/// <reference path="../Resources/Libs/Framework.d.ts" />
/// <reference path="../Resources/Libs/Mapping.Infrastructure.d.ts" />
var BarcodeScanner_TSModules;
(function (BarcodeScanner_TSModules) {
    var Utilities = (function () {
        function Utilities() {
        }
        Utilities.createNewGcxFeature = function (layerName, site, type, templateName, geometry) {
            if (!templateName) {
                return this.createNewGcxFeature(layerName, site, "default", "default", geometry);
            }
            var featureServices = site.getFeatureServices();
            //debugger;
            var layer;
            var featureTemplate;
            for (var i = 0; i < featureServices.length; i++) {
                if (featureServices[i].serviceLayer && featureServices[i].serviceLayer.name === layerName) {
                    var featureLayer = featureServices[i].serviceLayer;
                    var featureType;
                    if (featureLayer.types.length > 0) {
                        if (type.toLowerCase() === "default") {
                            // Get the first type if we are looking for default
                            featureType = featureLayer.types[0];
                        }
                        else {
                            // Loop through the types to find the one that we want.
                            for (var j = 0; j < featureLayer.types.length; j++) {
                                if (featureLayer.types[j].name === type) {
                                    featureType = featureLayer.types[j];
                                    break; //River added this line
                                }
                            }
                        }
                    }
                    var featureTemplates;
                    if (featureType) {
                        featureTemplates = featureType.templates;
                    }
                    else {
                        featureTemplates = featureLayer.templates;
                    }
                    // If there's more than 1 feature template we need to find the right one.
                    if (featureTemplates && featureTemplates.length > 0) {
                        if (templateName.toLowerCase() === "default") {
                            featureTemplate = featureTemplates[0];
                        }
                        else {
                            for (var k = 0; k < featureLayer.types[j].templates.length; k++) {
                                if (featureLayer.types[j].templates[k].name === templateName) {
                                    featureTemplate = featureLayer.types[j].templates[k];
                                    break;
                                }
                            }
                            if (!featureTemplate) {
                                featureTemplate = featureTemplates[0];
                            }
                        }
                    }
                    layer = featureServices[i].layers[0];
                    if (featureTemplate) {
                        var feature = new esri.Graphic(featureTemplate.prototype.toJson());
                        if (geometry) {
                            feature.setGeometry(geometry);
                        }
                    }
                    else {
                        var feature = new esri.Graphic(null);
                        feature.attributes = {};
                        if (geometry) {
                            feature.setGeometry(geometry);
                        }
                    }
                    var gcxFeature = new geocortex.essentialsHtmlViewer.mapping.infrastructure.Feature({ graphic: feature, layer: layer, resolveLayerFields: true });
                    return gcxFeature;
                }
            }
            return null;
        };
        Utilities.getFeatureService = function (layerName, site) {
            if (!site)
                return;
            var mapServices = site.getFeatureServices();
            if (mapServices && mapServices.length > 0) {
                for (var s in mapServices) {
                    var mapService = mapServices[s];
                    if (mapService.serviceLayer && mapService.serviceLayer.name === layerName) {
                        return mapService.serviceLayer;
                    }
                }
            }
            return null;
        };
        Utilities.getFeatureLayer = function (name, site) {
            var featureServices = site.getFeatureServices();
            var featureLayer;
            featureServices.forEach(function (featureService) {
                if (featureService.serviceLayer && featureService.serviceLayer.name === name) {
                    featureLayer = featureService.serviceLayer;
                    return;
                }
            });
            return featureLayer;
        };
        Utilities.getEssentialsLayer = function (name, site) {
            var essentialsLayer;
            var featureServices = site.getFeatureServices();
            featureServices.forEach(function (featureService) {
                if (featureService.findLayerByName(name)) {
                    essentialsLayer = featureService.findLayerByName(name);
                    return;
                }
            });
            return essentialsLayer;
        };
        Utilities.getMapServiceByLayer = function (layer, site) {
            // If the layer URL is null, it's an offline layer and will have layer metadata containing the online service URL.
            var layerUrl = layer.url || layer["_essentialsMetadata"]["serviceUrl"];
            if (!layerUrl) {
                return null;
            }
            var tokenIx = layerUrl.indexOf("?token=");
            // If the layer is token secured that token will be part of the url
            // If other parameters can be part of the url they may also need to be accounted for here
            // layer._url contains the url without any parameters but as a "private" variable I'd rather not touch it
            if (tokenIx != -1) {
                layerUrl = layerUrl.substring(0, tokenIx);
            }
            for (var i = 0; i < site.essentialsMap.mapServices.length; ++i) {
                var mapService = site.essentialsMap.mapServices[i];
                if (mapService.serviceUrl === layerUrl) {
                    return mapService;
                }
            }
            return null;
        };
        // Copied from geocortex.workflow.DefaultActivityHandlers (Essentials.js)
        Utilities.findMapServiceByMap = function (map, serviceId) {
            if (!map || !serviceId) {
                return null;
            }
            // Search regular layers
            if (map.layerIds != null) {
                for (var i = 0; i < map.layerIds.length; i++) {
                    var layer = map.getLayer(map.layerIds[i]);
                    if (layer != null && geocortex.essentials.utilities.SiteResourceIdComparer.equals(layer.id, serviceId)) {
                        // Found matching map service
                        return layer;
                    }
                }
            }
            // Search graphics layers
            if (map.graphicsLayerIds != null) {
                for (var i = 0; i < map.graphicsLayerIds.length; i++) {
                    var layer = map.getLayer(map.graphicsLayerIds[i]);
                    if (layer != null && geocortex.essentials.utilities.SiteResourceIdComparer.equals(layer.id, serviceId)) {
                        // Found matching map service
                        return layer;
                    }
                }
            }
            return null;
        };
        return Utilities;
    })();
    BarcodeScanner_TSModules.Utilities = Utilities;
})(BarcodeScanner_TSModules || (BarcodeScanner_TSModules = {}));
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
/// <reference path="../../Resources/Libs/Framework.d.ts" />
/// <reference path="../../Resources/Libs/Mapping.Infrastructure.d.ts" />
/// <reference path="../../utilities/utilities.ts" />
var BarcodeScanner_TSModules;
(function (BarcodeScanner_TSModules) {
    var TemplateModule = (function (_super) {
        __extends(TemplateModule, _super);
        function TemplateModule(app, lib) {
            _super.call(this, app, lib);
            //Git test
            this._testVariable = "";
            this._theApp = null;
            this._theMap = null;
            this.esriQuery = null;
            this.esriQueryTask = null;
            this._selectedFeature = null;
            //private dxFeatureInGpsExtentmap: { [id: string]: esri.Graphic; } = {};
            //identifyTask: esri.tasks.IdentifyTask = null;
            //identifyParams: esri.tasks.IdentifyParameters = null;
            this.seGasExpressURL = "http://52.1.143.233/arcgis103/rest/services/Schneiderville/SEGasExpress/FeatureServer";
            //arrayUtils: dojo._base.array = null;
            this.fscHandle = null;
            this.inventoryTable = null; //name needs to match config of <shell>.json.js file
            this.flagUri = null;
            this.viewModel = null;
            this._dxFeaturesInGPSExtentMap = null;
            this._cuCodeAssociatedWithBarcode = "";
            this.featureSetCollection = new Observable();
            this.featureSetCollection.bind(this, this._handleCollectionChanged);
            this._dxFeaturesInGPSExtentMap = {};
        }
        TemplateModule.prototype._handleCollectionChanged = function (fsc) {
            console.log(fsc.countFeatures());
        };
        TemplateModule.prototype.initialize = function (config) {
            var _this = this;
            //alert(this.app.getResource(this.libraryId, "hello-world-initialized"));
            this.app.command("doAffixBarcode").register(this, this.executeAffixBarcode);
            this.app.command("doScan").register(this, this.executeScan);
            this.app.command("doAddFeature").register(this, this.addFeature);
            this.app.command("doUpdateFeature").register(this, this.addFeature);
            this.app.command("doSelectFeature").register(this, this.selectFeature);
            this.app.command("doDeleteFeature").register(this, this.addFeature);
            this.app.command("doMockScanText").register(this, this.mockScan);
            this.app.command("doMockGPS").register(this, this.mockGPS);
            this.app.command("doZoomToGPS").register(this, this.zoomToGPS);
            this.app.command("doApply").register(this, this.apply);
            for (var p in config) {
                if (this.hasOwnProperty(p)) {
                    this[p] = config[p];
                }
            }
            this.app.event("TemplateModuleViewModelAttached").subscribe(this, function (model) {
                _this.viewModel = model;
            });
        };
        /*
        showResults(results: esri.tasks.FeatureSet) {
            this._dxFeaturesInGPSExtentMap = {};

            console.log("IN RESULTS");
            var counter: number = 0;
            for (var n = 0; n < results.features.length; n++){
                console.log(results.features[n]);

                this._dxFeaturesInGPSExtentMap[counter] = results.features[n];
                counter++;
            }
            _jsVariable = this._dxFeaturesInGPSExtentMap;

            $('#featuresInExtent').find('option').remove();
            $.each(this._dxFeaturesInGPSExtentMap, function (key: string, value: esri.Graphic) {
                try {
                    $('#featuresInExtent')
                        .append($("<option></option>")
                            .attr("value", key)
                            .text(value.attributes["CUCODE"]));
                }
                catch(ex){}
            });
            $('#dfcFeaturesFound').text(counter.toString() + " Features found near current position");
            this.selectTextInOptions();
        }*/
        TemplateModule.prototype.executeAffixBarcode2 = function () {
            console.log("In execute affix barcode");
            var aFL = new esri.layers.FeatureLayer("http://52.1.143.233/arcgis103/rest/services/Schneiderville/SEGasExpress/Featureserver/5");
            //var updateGraphcics = [];
            var selectedValue = $("#featuresInExtent option:selected").val();
            var index = parseInt(selectedValue);
            var g = this._dxFeaturesInGPSExtentMap[index];
            var barcode = $("#txtScanText").val();
            g.attributes["BARCODE"] = barcode; //"set by River";
            //updateGraphcics.push(g);
            aFL.applyEdits(null, [g], null, function () {
                console.log("something");
            }, function () {
                console.log("error");
            });
        };
        TemplateModule.prototype.executeAffixBarcode = function (FSCid) {
            var _this = this;
            var barcode = $("#txtScanText").val();
            this._selectedFeature.attributes["BARCODE"] = barcode;
            var layer = BarcodeScanner_TSModules.Utilities.getFeatureLayer("Dx Non-Controllable Fitting", this.app.site);
            //var mapService = Utilities.services.cBMobile.Utilities.LayerUtilities.getMapServiceByLayer(layer, this.app.site); //River Taig (commented)
            var mapService = BarcodeScanner_TSModules.Utilities.getMapServiceByLayer(layer, this.app.site); //River Taig
            var editDescriptor = {
                "mapService": mapService,
                "layer": layer,
                "feature": this._selectedFeature,
                "successCallback": function () {
                    console.log("editDescriptor successCallback");
                    var gcxFeature = new geocortex.essentialsHtmlViewer.mapping.infrastructure.Feature({
                        "featureLayer": layer,
                        "graphic": _this._selectedFeature
                    });
                    _this.app.command("ShowFeatureDetails").execute(gcxFeature);
                },
                "errorCallback": function (error) {
                    alert("failed: " + error.message);
                }
            };
            this.app.command("UpdateFeature").execute(editDescriptor);
        };
        TemplateModule.prototype.addFeature = function () {
            var _this = this;
            this.esriQueryTask = new esri.tasks.QueryTask("http://52.1.143.233/arcgis103/rest/services/Schneiderville/SEGasExpress/FeatureServer/11");
            this.esriQuery = new esri.tasks.Query();
            var mapPoint = this.getMapPointFromLatLong();
            var ext = new esri.geometry.Extent(mapPoint.x - 100, mapPoint.y - 100, mapPoint.x + 100, mapPoint.y + 100, this.app.map.spatialReference);
            this.esriQuery.geometry = ext;
            this.esriQuery.returnGeometry = true;
            this.esriQuery.spatialRelationship = "esriSpatialRelIntersects";
            this.esriQuery.outFields = ["*"];
            var that = this;
            this.esriQueryTask.execute(this.esriQuery, function (results) {
                var nearestDistanceSquared = 1000000;
                var snapPoint = null;
                for (var n = 0; n < results.features.length; n++) {
                    var esriGraphic = results.features[n];
                    var polyLine = esriGraphic.geometry;
                    for (var vert = 0; vert < polyLine.paths[0].length; vert++) {
                        var xCoord = polyLine.paths[0][vert][0];
                        var yCoord = polyLine.paths[0][vert][1];
                        var deltaX = (mapPoint.x - xCoord);
                        var deltaY = (mapPoint.y - yCoord);
                        var thisDistanceSquared = ((deltaX) * (deltaX)) + ((deltaY) * (deltaY));
                        if (thisDistanceSquared < nearestDistanceSquared) {
                            nearestDistanceSquared = thisDistanceSquared;
                            snapPoint = new esri.geometry.Point(xCoord, yCoord, that.app.map.spatialReference);
                        }
                    }
                }
                if (snapPoint != null) {
                    var barcode = $("#txtScanText").val();
                    //return;
                    var geom = snapPoint;
                    var newgcxFeature = BarcodeScanner_TSModules.Utilities.createNewGcxFeature("Dx Non-Controllable Fitting", _this.app.site, "Install", "Install", geom);
                    var feature = newgcxFeature.esriFeature.get();
                    feature.attributes["BARCODE"] = barcode; //TODO update with actualy barcode 
                    var layer = BarcodeScanner_TSModules.Utilities.getFeatureLayer("Dx Non-Controllable Fitting", _this.app.site);
                    //var mapService = Utilities.services.cBMobile.Utilities.LayerUtilities.getMapServiceByLayer(layer, this.app.site); //River Taig (commented)
                    var mapService = BarcodeScanner_TSModules.Utilities.getMapServiceByLayer(layer, _this.app.site); //River Taig
                    var editDescriptor = {
                        "mapService": mapService,
                        "layer": layer,
                        "feature": feature,
                        "successCallback": function () {
                            console.log("editDescriptor successCallback");
                            _this.app.command("ShowFeatureDetails").execute(newgcxFeature);
                        },
                        "errorCallback": function (error) {
                            alert("failed: " + error.message);
                        }
                    };
                    _this.app.command("CreateFeature").execute(editDescriptor); //River Taig
                }
            });
        };
        TemplateModule.prototype.apply = function () {
            alert("This will create or update a feature with the associated bar code: " +
                this.viewModel.code.get());
        };
        TemplateModule.prototype.getMapPointFromLatLong = function () {
            var gpsPositionToZoomTo = this.viewModel.gpsPosition.get();
            var partsOfStr = gpsPositionToZoomTo.split(',');
            var xlon = +partsOfStr[1];
            var ylat = +partsOfStr[0];
            var num = xlon * 0.017453292519943295;
            var x = 6378137.0 * num;
            var a = ylat * 0.017453292519943295;
            var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
            return new esri.geometry.Point(x, y, this.app.map.spatialReference);
        };
        TemplateModule.prototype.zoomToGPS = function () {
            var _this = this;
            //zoom to the gps position in the text box (may be a mocked position)
            var gpsPosition = $("#gpsPosition").val();
            //alert(gpsPosition);
            this.viewModel.gpsPosition.set(gpsPosition);
            var pnt = this.getMapPointFromLatLong();
            this.app.map.setExtent(new esri.geometry.Extent(pnt.x - 100, pnt.y - 100, pnt.x + 100, pnt.y + 100, this.app.map.spatialReference));
            this.drawGraphic(pnt);
            this.esriQueryTask = new esri.tasks.QueryTask("http://52.1.143.233/arcgis103/rest/services/Schneiderville/SEGasExpress/FeatureServer/5");
            this.esriQuery = new esri.tasks.Query();
            var mapPoint = this.getMapPointFromLatLong();
            var ext = new esri.geometry.Extent(mapPoint.x - 10000, mapPoint.y - 10000, mapPoint.x + 10000, mapPoint.y + 10000, this.app.map.spatialReference);
            this.esriQuery.geometry = ext;
            this.esriQuery.returnGeometry = true;
            this.esriQuery.spatialRelationship = "esriSpatialRelIntersects";
            this.esriQuery.outFields = ["*"];
            //this.esriQueryTask.execute(this.esriQuery, this.showResults);
            //var temp = this.selectFeature();
            var that = this;
            this.esriQueryTask.execute(this.esriQuery, function (results) {
                _this._dxFeaturesInGPSExtentMap = {};
                console.log("IN RESULTS");
                var counter = 0;
                for (var n = 0; n < results.features.length; n++) {
                    console.log(results.features[n]);
                    _this._dxFeaturesInGPSExtentMap[counter] = results.features[n];
                    counter++;
                }
                _jsVariable = _this._dxFeaturesInGPSExtentMap;
                $('#featuresInExtent').find('option').remove();
                $.each(_this._dxFeaturesInGPSExtentMap, function (key, value) {
                    try {
                        $('#featuresInExtent')
                            .append($("<option></option>")
                            .attr("value", key)
                            .text(value.attributes["CUCODE"]));
                    }
                    catch (ex) { }
                });
                $('#dfcFeaturesFound').text(counter.toString() + " Features found near current position");
                //that.selectFeature(that);
            });
        };
        TemplateModule.prototype.drawCircle = function (pnt, context) {
            if (typeof context == 'undefined') {
                context = this;
            }
            if (context._graphic !== null) {
                context.app.map.graphics.remove(context._graphic);
            }
            var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
            markerSymbol.size = 60;
            markerSymbol.style = "STYLE_CIRCLE";
            markerSymbol.setColor(new esri.Color([255, 0, 255, .5]));
            context._graphic = new esri.Graphic(pnt, markerSymbol);
            context.app.map.graphics.add(context._graphic);
        };
        TemplateModule.prototype.drawGraphic = function (pnt) {
            var markerSymbol = new esri.symbol.SimpleMarkerSymbol();
            markerSymbol.setPath("M9.5,3v10c8,0,8,4,16,4V7C17.5,7,17.5,3,9.5,3z M6.5,29h2V3h-2V29z");
            markerSymbol.setColor(new esri.Color("#0000FF"));
            this.app.map.graphics.add(new esri.Graphic(pnt, markerSymbol));
            //var pms: esri.symbol.PictureMarkerSymbol = new esri.symbol.PictureMarkerSymbol(this.flagUri +"../../Images/Flag.png", 24, 24);
            //this.app.map.graphics.add(new esri.Graphic(pnt, pms));
            //console.log("Added 1");
            //var pnt2: esri.geometry.Point = new esri.geometry.Point(pnt.x + 48, pnt.y, pnt.spatialReference);
            //this.app.map.graphics.add(new esri.Graphic(pnt2, pms));
            //console.log("Added 2");
        };
        TemplateModule.prototype.mockGPS = function () {
            //Pressing the mock button sets the gps position
            this.viewModel.gpsPosition.set("29.652098,-82.339335"); //13th and University
        };
        TemplateModule.prototype.mockScan = function () {
            //this.viewModel.code.set("ABC-019");
            //this.setFields("ABC-019");
            NextScan("");
            this.afterScan();
        };
        TemplateModule.prototype.afterScan = function () {
            var barcode = $('#txtScanText').val();
            this._cuCodeAssociatedWithBarcode = "";
            this.viewModel.scanText = barcode;
            this.retrieveBarcodeMetaData(barcode);
        };
        TemplateModule.prototype.retrieveBarcodeMetaData = function (barcode) {
            var _this = this;
            $('#barcodeTable tbody').remove();
            this.esriQueryTask = new esri.tasks.QueryTask("http://52.1.143.233/arcgis103/rest/services/Schneiderville/SEGasExpress/FeatureServer/12");
            this.esriQuery = new esri.tasks.Query();
            this.esriQuery.where = "BARCODE = '" + barcode + "'";
            this.esriQuery.outFields = ["*"];
            this.esriQueryTask.execute(this.esriQuery, function (results) {
                for (var i = 0; i < results.features.length; i++) {
                    var gr = results.features[i];
                    var nameValPairs = gr.attributes["NameValuePairs"];
                    var nameValuePairArray = nameValPairs.split(',');
                    for (var j = 0; j < nameValuePairArray.length; j++) {
                        var nameValuePair = nameValuePairArray[j];
                        var nameAndValue = nameValuePair.split('|');
                        var appendString = "<tr><td>" + nameAndValue[0] + "</td ><td>" + nameAndValue[1] + "</td></tr>";
                        //alert(appendString);
                        $('#barcodeTable').append(appendString);
                        if (nameAndValue[0] == "CU-CODE") {
                            _this._cuCodeAssociatedWithBarcode = nameAndValue[1];
                        }
                    }
                }
                //$('#myTable').append('<tr><td>my data</td><td>more data</td></tr>');
                _this.selectTextInOptions();
            });
            //Now lets fine out if any values in the select options have a matching CUCode
        };
        //This selects the text in the option, and then calls selectFeature which will actually cause a zoom and a highlight circle.
        TemplateModule.prototype.selectTextInOptions = function () {
            var text = this._cuCodeAssociatedWithBarcode;
            $("select#featuresInExtent option")
                .each(function () {
                this.selected = (this.text == text);
            });
            var isSomethingSelected = true;
            if ($("#featuresInExtent option:selected").length == 0) {
                isSomethingSelected = false;
            }
            if (isSomethingSelected) {
                $("#MatchingCUCode").html("A design feature with a CU-code matching the scanned barcode was found.");
                $('#MatchingCUCode').css('color', "green");
                $('#btnAffix').removeAttr('disabled');
                this.selectFeature(this);
            }
            else {
                $("#MatchingCUCode").html("A design feature with a CU-code matching the scanned barcode was NOT found.");
                $('#MatchingCUCode').css('color', "red");
                $('#btnAffix').attr('disabled', 'disabled');
                alert("matching feature not found");
            }
        };
        TemplateModule.prototype.setFields = function (scanResult) {
            var inventoryRecord = this.inventoryTable[scanResult];
            //this.viewModel.field1.set(inventoryRecord.field1);
            //this.viewModel.field2.set(inventoryRecord.field2);
        };
        //selectFeature is triggered when the user selects an option in the select box. The feature is zoomed to and a pink circle is drawn
        TemplateModule.prototype.selectFeature = function (context) {
            if (typeof context == 'undefined') {
                context = this;
            }
            context._dxFeaturesInGPSExtentMap = _jsVariable;
            var selectedValue = $("#featuresInExtent option:selected").val();
            var index = parseInt(selectedValue);
            context._selectedFeature = context._dxFeaturesInGPSExtentMap[index];
            var pnt;
            pnt = context._selectedFeature.geometry;
            var ext = new esri.geometry.Extent(pnt.x - 50, pnt.y - 50, pnt.x + 50, pnt.y + 50, context.app.map.spatialReference);
            context.app.map.setExtent(ext);
            console.log(context._selectedFeature.geometry.type);
            context.drawCircle(pnt);
        };
        /*this.viewModel.codeFound.set(true);
var gpsPos = "Unknown Location";
navigator.geolocation.getCurrentPosition((position: Position) => {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);
    gpsPos = position.coords.latitude.toString() + "," + position.coords.longitude.toString();
    this.viewModel.gpsPosition.set(gpsPos);
    console.log(position.coords.accuracy);
}, (positionError: PositionError) => { alert(positionError.message); },
{ enableHighAccuracy: true, timeout: 10000 });

this.viewModel.code.set(scanResult.content);
if (this.inventoryTable.hasOwnProperty(scanResult.content)) {
    this.setFields(scanResult.content);
    //var inventoryRecord :any = this.inventoryTable[scanResult.content];
    //this.viewModel.field1.set(inventoryRecord.field1);
    //this.viewModel.field2.set(inventoryRecord.field2);
    //this.viewModel.gpsPosition.set(gpsPos);
}
else {
    this.viewModel.codeFound.set(false);
}
*/
        TemplateModule.prototype.executeScan = function () {
            var _this = this;
            //alert("About to scan - 124");
            try {
                this.app.command("LaunchBarcodeScannerWithCallback").execute(function (scanResult) {
                    ;
                    var s = (JSON.stringify(scanResult));
                    //alert(s);
                    if (scanResult.status == "Success") {
                        NextScan(scanResult.content.toString());
                        _this.afterScan();
                    }
                    else {
                        alert("An error occurred: " + scanResult.status);
                    }
                });
            }
            catch (Exception) {
            }
        };
        return TemplateModule;
    })(geocortex.framework.application.ModuleBase);
    BarcodeScanner_TSModules.TemplateModule = TemplateModule;
})(BarcodeScanner_TSModules || (BarcodeScanner_TSModules = {}));
var _jsVariable;
/// <reference path="../../Resources/Libs/Framework.d.ts" />
/// <reference path="../../Resources/Libs/Mapping.Infrastructure.d.ts" />
var BarcodeScanner_TSModules;
(function (BarcodeScanner_TSModules) {
    var TemplateModuleView = (function (_super) {
        __extends(TemplateModuleView, _super);
        function TemplateModuleView(app, lib) {
            _super.call(this, app, lib);
        }
        TemplateModuleView.prototype.attach = function (viewModel) {
            var _this = this;
            _super.prototype.attach.call(this, viewModel);
            $("#btnAffix").on('click', function () {
                _this.app.command("doAffixBarcode").execute();
            });
            $("#featuresInExtent").on('change', function () {
                _this.app.command("doSelectFeature").execute();
            });
            $("#btnInstall").on('click', function () {
                _this.app.command("doAddFeature").execute();
            });
            $("#btnScan").on('click', function () {
                _this.app.command("doScan").execute();
            });
            $("#scanCode").on('click', function () {
                _this.app.command("doMockScan").execute();
            });
            $("#btnMock").on('click', function () {
                _this.app.command("doMockGPS").execute();
            });
            $("#btnZoomToGPS").on('click', function () {
                _this.app.command("doZoomToGPS").execute();
            });
            $("#mockScanText").on('click', function () {
                _this.app.command("doMockScanText").execute();
            });
            $("#btnApply").on('click', function () {
                _this.app.command("doApply").execute();
            });
            this.app.event("TemplateModuleViewModelAttached").publish(viewModel);
        };
        return TemplateModuleView;
    })(geocortex.framework.ui.ViewBase);
    BarcodeScanner_TSModules.TemplateModuleView = TemplateModuleView;
})(BarcodeScanner_TSModules || (BarcodeScanner_TSModules = {}));
var gpsMockIndex = -1;
var scanMockIndex = -1;
var foundToggle = true;
function NextGpsPosition() {
    //var path = $('#zoomImage').attr('src');
    //alert(path);
    $('#WhenScanComplete').css('display', "none");
    $('#txtScanText').val("-----------------");
    if ($("#chkMockGPS").is(":checked")) {
        var array = ($("#txtMockGPS").val());
        gpsMockIndex++;
        if (gpsMockIndex >= array.split('|').length) {
            gpsMockIndex = 0;
        }
        //$("#gpsPosition").html(array.split('|')[gpsMockIndex]);
        $("#gpsPosition").val(array.split('|')[gpsMockIndex]);
    }
    else {
        alert("Getting gps position");
    }
    $("#MatchingCUCode").html("");
    $('#MatchingCUCode').css('color', "green");
}
function ZoomToMyFeature() {
    alert("Test");
}
function NextScan(codeFromScanner) {
    var spanCode = "Not found";
    if ($("#chkMockScans").is(":checked")) {
        var array = ($("#txtMockScan").val());
        scanMockIndex++;
        if (scanMockIndex >= array.split('|').length) {
            scanMockIndex = 0;
        }
        spanCode = array.split('|')[scanMockIndex];
    }
    else {
        spanCode = codeFromScanner;
    }
    $('#WhenScanComplete').css('display', "block");
    $("#attributesOfText").html(" " + spanCode);
    $("#txtScanText").val(spanCode);
}
function ApplyDemoConditions() {
    if ($("#chkMockGPS").is(":checked")) {
        $("#gpsPosition").html($("#txtMockGPS").val());
    }
    if ($("#chkMockScans").is(":checked")) {
        $("#scanCode").html($("#txtFirstScan").val());
        $("#replaceScanCode").html($("#txtSecondScan").val());
        $("#scanCodeText").html($("#txtFirstScan").val());
        $("#replaceScanCodeText").html($("#txtSecondScan").val());
    }
    if ($("#radNearby").is(":checked")) {
        $("#dfcFeaturesFound").html("Nearby Design Features Found!");
        $('#dfcFeaturesFound').css('color', "green");
    }
    else {
        $("#dfcFeaturesFound").html("No nearby Design Features Found!");
        $('#dfcFeaturesFound').css('color', "red");
    }
    if ($("#radFound").is(":checked")) {
        $("#scanCodeFound").html("Barcode found on Reducer with FacilityID = XXX-777");
        $('#scanCodeFound').css('color', "green");
    }
    else {
        $("#scanCodeFound").html("Barcode not found in design, but exists in inventory.");
        $('#scanCodeFound').css('color', "blue");
    }
}
function ToggleDemoConditions() {
    if ($("#demoConditions").css("display") == "block") {
        $("#demoConditions").css("display", "none");
    }
    else {
        $("#demoConditions").css("display", "block");
    }
}
/// <reference path="../../Resources/Libs/Framework.d.ts" />
/// <reference path="../../Resources/Libs/Mapping.Infrastructure.d.ts" />
var BarcodeScanner_TSModules;
(function (BarcodeScanner_TSModules) {
    var TemplateModuleViewModel = (function (_super) {
        __extends(TemplateModuleViewModel, _super);
        function TemplateModuleViewModel(app, lib) {
            _super.call(this, app, lib);
            this.code = new Observable();
            this.showCodeNotFound = new Observable();
            this.codeFound = new Observable(true);
            this.scanText = new Observable();
            this.gpsPosition = new Observable();
        }
        TemplateModuleViewModel.prototype.initialize = function (config) {
            var _this = this;
            this.codeFound.bind(this, function (value) {
                _this.showCodeNotFound.set(!value);
            });
        };
        return TemplateModuleViewModel;
    })(geocortex.framework.ui.ViewModelBase);
    BarcodeScanner_TSModules.TemplateModuleViewModel = TemplateModuleViewModel;
})(BarcodeScanner_TSModules || (BarcodeScanner_TSModules = {}));
//# sourceMappingURL=BarcodeScanner_Modules_ts_out.js.map

/* End Script: Resources/TSout/BarcodeScanner_Modules_ts_out.js ------------------------- */ 

geocortex.resourceManager.register("BarcodeScanner_Modules","inv","Modules/Template/TemplateModuleView.html","html","PGRpdiBjbGFzcz0idGVtcGxhdGUtbW9kdWxlLXZpZXciPg0KICAgIDxkaXYgaWQ9ImRlbW9Db25kaXRpb25zIj4NCiAgICAgICAgPGRpdiBpZD0ibW9kZSI+DQogICAgICAgICAgICA8aDI+RGVtb25zdHJhdGlvbiBDb25maWd1cmF0aW9uIEFyZWEhISE8L2gyPg0KICAgICAgICA8L2Rpdj4NCiAgICAgICAgPGJyPjxkaXYgaWQ9ImNoZWNrYm94ZXMiPg0KICAgICAgICAgICAgPGlucHV0IHR5cGU9ImNoZWNrYm94IiBpZD0iY2hrTW9ja0dQUyIgY2hlY2tlZD5Nb2NrIFBvc2l0aW9uIChsYXQuLGxvbmcuKTogJm5ic3A7PC9JTlBVVD48aW5wdXQgdHlwZT0idGV4dCIgdmFsdWU9IjI5LjcyLC04Mi40M3wyOS42NTMsLTgyLjM0fDI5LjY0NDU5MywtODIuMzI1MDIwfDI5LjY1MDU0MCwgLTgyLjM0Mjc4NnwyOS42Mzk5NzEsIC04Mi4zNjc2MzciIGlkPSJ0eHRNb2NrR1BTIiAvPg0KICAgICAgICAgICAgPGJyPjxicj4NCiAgICAgICAgICAgIDxpbnB1dCB0eXBlPSJjaGVja2JveCIgY2hlY2tlZCBpZD0iY2hrTW9ja1NjYW5zIj5Nb2NrIFNjYW4gJm5ic3A7IFNjYW46IDwvSU5QVVQ+PGlucHV0IHR5cGU9InRleHQiIHZhbHVlPSJBQkMtMDE5fEFCQy0wMDF8QUJDLTAwMnxBQkMtMDAzIiBpZD0idHh0TW9ja1NjYW4iIC8+DQoNCiAgICAgICAgPC9kaXY+DQoNCiAgICA8L2Rpdj4NCg0KICAgIDxkaXYgaWQ9InBvc2l0aW9uRGl2Ij4NCiAgICAgICAgPGltYWdlIHNyYz0iUmVzb3VyY2VzL0ltYWdlcy9ab29tVG9HUFMucG5nIiBpZD0iYnRuWm9vbVRvR1BTIj48L2ltYWdlPiZuYnNwOyZuYnNwOyZuYnNwOw0KICAgICAgICA8ZGl2IGlkPSJwb3NpdGlvblRleHQiPg0KICAgICAgICAgICAgPGxhYmVsIG9uY2xpY2s9Ik5leHRHcHNQb3NpdGlvbigpIj5HUFMgUG9zaXRpb246IDwvbGFiZWw+IDxpbnB1dCB0eXBlPSJ0ZXh0IiB3aWR0aD0iMzAiIGlkPSJncHNQb3NpdGlvbiIgZGF0YS1iaW5kaW5nPSJ7QHZhbHVlOiBncHNQb3NpdGlvbn0iIC8+DQogICAgICAgICAgICA8c3BhbiBpZD0iZGZjRmVhdHVyZXNGb3VuZCIgb25jbGljaz0iVG9nZ2xlRGVtb0NvbmRpdGlvbnMoKSI+MCBkZXNpZ24gZmVhdHVyZXMgZm91bmQhPC9zcGFuPg0KICAgICAgICA8L2Rpdj4NCiAgICA8L2Rpdj4NCiAgICA8aW1hZ2UgaWQ9ImJ0blNjYW4iICBzcmM9IlJlc291cmNlcy9JbWFnZXMvYmFyY29kZS5wbmciPjwvaW1hZ2U+Jm5ic3A7Jm5ic3A7Jm5ic3A7DQogICAgPGRpdiBpZD0ic2NhblRleHQiPg0KICAgICAgICA8bGFiZWwgIGlkPSJtb2NrU2NhblRleHQiPlNjYW4gQ29kZTogPC9sYWJlbD4NCiAgICAgICAgPGlucHV0IHR5cGU9InRleHQiIHdpZHRoPSIzMCIgaWQ9InR4dFNjYW5UZXh0IiB2YWx1ZT0iLS0tLS0tLS0tLS0tLS0tLS0iIGRhdGEtYmluZGluZz0ie0B2YWx1ZTogc2NhblRleHR9IiAvPg0KICAgIDwvZGl2Pg0KICAgIA0KICAgIDxkaXYgaWQ9Ik1hdGNoaW5nQ1VDb2RlIj48L2Rpdj4NCg0KICAgIDxkaXYgaWQ9IldoZW5TY2FuQ29tcGxldGUiPg0KICAgICAgICA8aHI+DQogICAgICAgIDxkaXYgaWQ9InNjYW5BdHRyaWJ1dGVzIj5BdHRyaWJ1dGVzIG9mIDxzcGFuIGlkPSJhdHRyaWJ1dGVzT2ZUZXh0Ij4tLS08L3NwYW4+PC9kaXY+DQogICAgICAgIDxkaXYgaWQ9InRhYmxlIj4NCiAgICAgICAgICAgIDx0YWJsZSBpZD0iYmFyY29kZVRhYmxlIiBib3JkZXI9IjAiPg0KICAgICAgICAgICAgICAgIDx0aD5GSUVMRDwvdGg+DQogICAgICAgICAgICAgICAgPHRoPlZBTFVFPC90aD4NCiAgICAgICAgICAgICAgICA8IS0tDQogICAgICAgICAgICAgICAgPHRyPjx0ZD5DVSBDb2RlPC90ZD48dGQ+WlhDVi0xMjM0PC90ZD48L3RyPg0KICAgICAgICAgICAgICAgIDx0cj48dGQ+U3VieXRlQ0Q8L3RkPjx0ZD5SZWR1Y2VyPC90ZD48L3RyPg0KICAgICAgICAgICAgICAgIDx0cj48dGQ+TWF0ZXJpYWw8L3RkPjx0ZD5QbGFzdGljPC90ZD48L3RyPg0KICAgICAgICAgICAgICAgIDx0cj48dGQ+RGlhbWV0ZXI8L3RkPjx0ZD4uNSI8L3RkPjwvdHI+DQogICAgICAgICAgICAgICAgPHRyPjx0ZD5TdHlsZTwvdGQ+PHRkPkNoaWNhZ288L3RkPjwvdHI+LS0+DQogICAgICAgICAgICA8L3RhYmxlPg0KICAgICAgICA8L2Rpdj4NCiAgICAgICAgPGRpdj4NCiAgICAgICAgICAgIDxicj4NCiAgICAgICAgICAgIDxkaXYgaWQ9IkRlc2lnbkZlYXR1cmVzV2l0aGluMzBtIj5EZXNpZ24gZmVhdHVyZXMgd2l0aGluIDMwbTwvZGl2Pg0KICAgICAgICAgICAgPHNlbGVjdCBuYW1lPSJzb21ldGV4dCIgb25jbGljaz0iWm9vbVRvTXlGZWF0dXJlIiBzaXplPSI1IiBpZD0iZmVhdHVyZXNJbkV4dGVudCI+DQoNCiAgICAgICAgICAgIDwvc2VsZWN0Pg0KICAgICAgICAgICAgPGhyPg0KICAgICAgICAgICAgPGRpdj4NCg0KICAgICAgICAgICAgICAgIDxkaXYgaWQ9IkJ1dHRvbnMiPg0KICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT0iYnV0dG9uIiBpZD0iYnRuQWZmaXgiIGRpc2FibGVkPSJ0cnVlIiAgdmFsdWU9IkFmZml4IEJhcmNvZGUiIC8+DQogICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPSJidXR0b24iIGlkPSJidG5SZXBsYWNlIiBvbmNsaWNrPSJhbGVydCgnRGVsZXRlIGV4aXN0aW5nIGZlYXR1cmUgdGhlbiBjcmVhdGUgbmV3IG9uZSB3aXRoIGJhcmNvZGUgYXR0cmlidXRlcycpIiB2YWx1ZT0iUmVwbGFjZSIgLz4NCiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9ImJ1dHRvbiIgaWQ9ImJ0bkluc3RhbGwiICB2YWx1ZT0iSW5zdGFsbCIgLz4NCiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9ImJ1dHRvbiIgaWQ9ImJ0bkNhbmNlbCIgb25jbGljaz0iYWxlcnQoJ0NhbmNlbCcpIiB2YWx1ZT0iQ2FuY2VsIiAvPg0KICAgICAgICAgICAgICAgIDwvZGl2Pg0KICAgICAgICAgICAgPC9kaXY+DQogICAgICAgICAgICA8YnIgLz48YnIgLz4NCiAgICAgICAgPC9kaXY+DQoNCg0KICAgICAgICA8IS0tDQogICAgICAgIDxkaXYgY2xhc3M9InRlbXBsYXRlLW1vZHVsZS12aWV3Ij4NCiAgICAgICAgPGI+PHNwYW4gZGF0YS1iaW5kaW5nPSJ7QHRleHQ6IGdyZWV0aW5nfSI+PC9zcGFuPjwvYj4NCiAgICAgICAgICAgIDxkaXYgaWQ9InNjYW5BcmVhIj4NCiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPSJidG5BZGQiIGNsYXNzPSJidXR0b24iPkFkZDwvYnV0dG9uPg0KICAgICAgICAgICAgICAgIDxidXR0b24gaWQ9ImJ0blNjYW4iIGNsYXNzPSJidXR0b24iPlNjYW48L2J1dHRvbj4NCiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPSJidG5Nb2NrU2NhbiIgY2xhc3M9ImJ1dHRvbiI+TW9jayBTY2FuPC9idXR0b24+DQogICAgICAgICAgICAgICAgPGRpdiBpZD0ic2NhblJlc3VsdCIgZGF0YS1iaW5kaW5nPSJ7QHRleHQ6IGNvZGV9Ij5QcmVzcyBTY2FuPC9kaXY+DQogICAgICAgICAgICAgICAgPGxhYmVsPkdQUyBQb3NpdGlvbjogPC9sYWJlbD4gPGlucHV0IHR5cGU9InRleHQiIHdpZHRoPSIzMCIgaWQ9Imdwc1Bvc2l0aW9uIiBkYXRhLWJpbmRpbmc9IntAdmFsdWU6IGdwc1Bvc2l0aW9ufSIgLz4NCiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPSJidG5ab29tVG9HUFMiIGNsYXNzPSJidXR0b24iPlpvb20gdG88L2J1dHRvbj4NCiAgICAgICAgICAgICAgICA8YnV0dG9uIGlkPSJidG5Nb2NrIiBjbGFzcz0iYnV0dG9uIj5Nb2NrIEdQUzwvYnV0dG9uPg0KICAgICAgICAgICAgPC9kaXY+DQogICAgICAgICAgICA8ZGl2IGlkPSJzY2FuTm90Rm91bmQiIGRhdGEtYmluZGluZz0ie0B2aXNpYmxlOiBzaG93Q29kZU5vdEZvdW5kfSI+U2NhbiBkaWQgbm90IHdvcmshIDwvZGl2Pg0KICAgICAgICAgICAgPGRpdiBpZD0ic2NhblJlc3VsdHMiPg0KICAgICAgICAgICAgICAgIDxsYWJlbD5GaWVsZCAxOiA8L2xhYmVsPiA8aW5wdXQgdmFsdWU9ImRlZmF1bHQiIHR5cGU9InRleHQiIGlkPSJmaWVsZDEiIGRhdGEtYmluZGluZz0ie0B2YWx1ZTogZmllbGQxfSIvPg0KICAgICAgICAgICAgICAgIDxsYWJlbD5GaWVsZCAyOiA8L2xhYmVsPiA8aW5wdXQgdHlwZT0idGV4dCIgaWQ9ImZpZWxkMiIgZGF0YS1iaW5kaW5nPSJ7QHZhbHVlOiBmaWVsZDJ9IiAvPg0KICAgICAgICAgICAgPC9kaXY+DQogICAgICAgICAgICA8ZGl2Pg0KICAgICAgICAgICAgICAgIGFzZGYgdG8gcG9wdWxhciBiZWxpZWYsIExvcmVtIElwc3VtIGlzIG5vdCBzaW1wbHkgcmFuZG9tIHRleHQuIEl0IGhhcyByb290cyBpbiBhIHBpZWNlIG9mIGNsYXNzaWNhbCBMYXRpbiBsaXRlcmF0dXJlIGZyb20gNDUgQkMsIG1ha2luZyBpdCBvdmVyIDIwMDAgeWVhcnMgb2xkLiBSaWNoYXJkIE1jQ2xpbnRvY2ssIGEgTGF0aW4gcHJvZmVzc29yIGF0IEhhbXBkZW4tU3lkbmV5IENvbGxlZ2UgaW4gVmlyZ2luaWEsIGxvb2tlZCB1cCBvbmUgb2YgdGhlIG1vcmUgb2JzY3VyZSBMYXRpbiB3b3JkcywgY29uc2VjdGV0dXIsIGZyb20gYSBMb3JlbSBJcHN1bSBwYXNzYWdlLCBhbmQgZ29pbmcgdGhyb3VnaCB0aGUgY2l0ZXMgb2YgdGhlIHdvcmQgaW4gY2xhc3NpY2FsIGxpdGVyYXR1cmUsIGRpc2NvdmVyZWQgdGhlIHVuZG91YnRhYmxlIHNvdXJjZS4gTG9yZW0gSXBzdW0gY29tZXMgZnJvbSBzZWN0aW9ucyAxLjEwLjMyIGFuZCAxLjEwLjMzIG9mICJkZSBGaW5pYnVzIEJvbm9ydW0gZXQgTWFsb3J1bSIgKFRoZSBFeHRyZW1lcyBvZiBHb29kIGFuZCBFdmlsKSBieSBDaWNlcm8sIHdyaXR0ZW4gaW4gNDUgQkMuIFRoaXMgYm9vayBpcyBhIHRyZWF0aXNlIG9uIHRoZSB0aGVvcnkgb2YgZXRoaWNzLCB2ZXJ5IHBvcHVsYXIgZHVyaW5nIHRoZSBSZW5haXNzYW5jZS4gVGhlIGZpcnN0IGxpbmUgb2YgTG9yZW0gSXBzdW0sICJMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldC4uIiwgY29tZXMgZnJvbSBhIGxpbmUgaW4gc2VjdGlvbiAxLjEwLjMyDQogICAgICAgICAgICAgICAgQ29udHJhcnkgdG8gcG9wdWxhciBiZWxpZWYsIExvcmVtIElwc3VtIGlzIG5vdCBzaW1wbHkgcmFuZG9tIHRleHQuIEl0IGhhcyByb290cyBpbiBhIHBpZWNlIG9mIGNsYXNzaWNhbCBMYXRpbiBsaXRlcmF0dXJlIGZyb20gNDUgQkMsIG1ha2luZyBpdCBvdmVyIDIwMDAgeWVhcnMgb2xkLiBSaWNoYXJkIE1jQ2xpbnRvY2ssIGEgTGF0aW4gcHJvZmVzc29yIGF0IEhhbXBkZW4tU3lkbmV5IENvbGxlZ2UgaW4gVmlyZ2luaWEsIGxvb2tlZCB1cCBvbmUgb2YgdGhlIG1vcmUgb2JzY3VyZSBMYXRpbiB3b3JkcywgY29uc2VjdGV0dXIsIGZyb20gYSBMb3JlbSBJcHN1bSBwYXNzYWdlLCBhbmQgZ29pbmcgdGhyb3VnaCB0aGUgY2l0ZXMgb2YgdGhlIHdvcmQgaW4gY2xhc3NpY2FsIGxpdGVyYXR1cmUsIGRpc2NvdmVyZWQgdGhlIHVuZG91YnRhYmxlIHNvdXJjZS4gTG9yZW0gSXBzdW0gY29tZXMgZnJvbSBzZWN0aW9ucyAxLjEwLjMyIGFuZCAxLjEwLjMzIG9mICJkZSBGaW5pYnVzIEJvbm9ydW0gZXQgTWFsb3J1bSIgKFRoZSBFeHRyZW1lcyBvZiBHb29kIGFuZCBFdmlsKSBieSBDaWNlcm8sIHdyaXR0ZW4gaW4gNDUgQkMuIFRoaXMgYm9vayBpcyBhIHRyZWF0aXNlIG9uIHRoZSB0aGVvcnkgb2YgZXRoaWNzLCB2ZXJ5IHBvcHVsYXIgZHVyaW5nIHRoZSBSZW5haXNzYW5jZS4gVGhlIGZpcnN0IGxpbmUgb2YgTG9yZW0gSXBzdW0sICJMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldC4uIiwgY29tZXMgZnJvbSBhIGxpbmUgaW4gc2VjdGlvbiAxLjEwLjMyDQogICAgICAgICAgICAgICAgQ29udHJhcnkgdG8gcG9wdWxhciBiZWxpZWYsIExvcmVtIElwc3VtIGlzIG5vdCBzaW1wbHkgcmFuZG9tIHRleHQuIEl0IGhhcyByb290cyBpbiBhIHBpZWNlIG9mIGNsYXNzaWNhbCBMYXRpbiBsaXRlcmF0dXJlIGZyb20gNDUgQkMsIG1ha2luZyBpdCBvdmVyIDIwMDAgeWVhcnMgb2xkLiBSaWNoYXJkIE1jQ2xpbnRvY2ssIGEgTGF0aW4gcHJvZmVzc29yIGF0IEhhbXBkZW4tU3lkbmV5IENvbGxlZ2UgaW4gVmlyZ2luaWEsIGxvb2tlZCB1cCBvbmUgb2YgdGhlIG1vcmUgb2JzY3VyZSBMYXRpbiB3b3JkcywgY29uc2VjdGV0dXIsIGZyb20gYSBMb3JlbSBJcHN1bSBwYXNzYWdlLCBhbmQgZ29pbmcgdGhyb3VnaCB0aGUgY2l0ZXMgb2YgdGhlIHdvcmQgaW4gY2xhc3NpY2FsIGxpdGVyYXR1cmUsIGRpc2NvdmVyZWQgdGhlIHVuZG91YnRhYmxlIHNvdXJjZS4gTG9yZW0gSXBzdW0gY29tZXMgZnJvbSBzZWN0aW9ucyAxLjEwLjMyIGFuZCAxLjEwLjMzIG9mICJkZSBGaW5pYnVzIEJvbm9ydW0gZXQgTWFsb3J1bSIgKFRoZSBFeHRyZW1lcyBvZiBHb29kIGFuZCBFdmlsKSBieSBDaWNlcm8sIHdyaXR0ZW4gaW4gNDUgQkMuIFRoaXMgYm9vayBpcyBhIHRyZWF0aXNlIG9uIHRoZSB0aGVvcnkgb2YgZXRoaWNzLCB2ZXJ5IHBvcHVsYXIgZHVyaW5nIHRoZSBSZW5haXNzYW5jZS4gVGhlIGZpcnN0IGxpbmUgb2YgTG9yZW0gSXBzdW0sICJMb3JlbSBpcHN1bSBkb2xvciBzaXQgYW1ldC4uIiwgY29tZXMgZnJvbSBhIGxpbmUgaW4gc2VjdGlvbiAxLjEwLjMyDQogICAgICAgICAgICA8L2Rpdj4NCiAgICAgICAgICAgIDxidXR0b24gaWQ9ImJ0bkFwcGx5IiBjbGFzcz0iYnV0dG9uIj5BcHBseTwvYnV0dG9uPg0KICAgICAgICA8L2Rpdj4tLT4NCg==");
geocortex.resourceManager.register("BarcodeScanner_Modules","inv","Modules/Template/TemplateModule.css","css","DQoucmVnaW9uIC52aWV3LlRlbXBsYXRlTW9kdWxlVmlldy5hY3RpdmUgew0KICAgIG1hcmdpbi1sZWZ0OiA1cHg7DQogICAgbWFyZ2luLXJpZ2h0OiA1cHg7DQp9DQoNCi50ZW1wbGF0ZS1tb2R1bGUtdmlldw0Kew0KICAgIHotaW5kZXg6IDEwMDsNCiAgICB3aWR0aDogNTAlOw0KICAgIGRpc3BsYXk6aW5saW5lOw0KICAgIGJhY2tncm91bmQ6IHdoaXRlOw0KICAgIGNvbG9yOiBibGFjazsNCiAgICBwYWRkaW5nOiA2cHg7DQogICAgbWFyZ2luLWxlZnQ6IDVweDsNCn0NCi5zY2FuTm90Rm91bmR7DQogICAgY29sb3I6cmVkOw0KfQ0KDQoNCg0KdGh7DQp3aWR0aDoxNTBweDsNCmZvbnQtc2l6ZToxMDsNCnRleHQtYWxpZ246bGVmdDsNCn0NCg0KI3NjYW5BdHRyaWJ1dGVzLCAjcmVwbGFjZVNjYW5BdHRyaWJ1dGVzLCNEZXNpZ25GZWF0dXJlc1dpdGhpbjMwbXsNCmNvbG9yOndoaXRlOw0KbWFyZ2luLWJvdHRvbSA6IDVweCA7DQpoZWlnaHQ6IDEyMCU7DQpiYWNrZ3JvdW5kLWNvbG9yOmdyYXk7DQoNCn0NCiNXaGVuU2NhbkNvbXBsZXRlew0KZGlzcGxheTogbm9uZTsNCn0NCiNiYXJjb2RlRm91bmR7DQpmb250LXN0eWxlOml0YWxpYzsNCm1hcmdpbiA6IDAgMCAxMCAwIDsNCn0NCiNzY2FuQ29kZXsNCmNvbG9yOmdyZWVuOw0KfQ0KI3JlcGxhY2VTY2FuQ29kZXsNCmNvbG9yOmdyZWVuOw0KfQ0KI2NoZWNrYm94ZXN7DQptYXJnaW46MCAwIDEwIDA7DQp9DQp0cg0Kew0KZm9udC1zaXplOjEwOw0KfQ0KI3Bvc2l0aW9uRGl2ew0KbWFyZ2luOiAxMCAwIDAgMCA7DQp9DQojZ3BzUG9zaXRpb24sI3R4dFNjYW5UZXh0ew0KY29sb3I6IGJsdWU7DQp9DQojcG9zaXRpb25UZXh0ew0KZGlzcGxheTppbmxpbmU7DQp2ZXJ0aWNhbC1hbGlnbjo4cHg7DQp9DQojc2NhblRleHR7DQpkaXNwbGF5OmlubGluZTsNCnZlcnRpY2FsLWFsaWduOjhweDsNCn0NCiNyZW1vdmVSZXBsYWNlew0KZGlzcGxheTpub25lOw0KfQ0KI2J0blJlcGxhY2VTY2FuDQp7DQptYXJnaW46MCAwIDIwIDAgOw0KY29sb3I6Z3JlZW47DQp9DQojYnRuU2NhbnsNCmNvbG9yOmdyZWVuOw0KfQ0KI25vREZDRmVhdHVyZXNGb3VuZHsNCmRpc3BsYXk6bm9uZTsNCn0NCiNpbnN0YWxsSnVuY3Rpb25FZGdlew0KZGlzcGxheTpibG9jazsNCn0NCnRhYmxlLCB0ZCwgdGggew0KICAgIGJvcmRlcjogMXB4IHNvbGlkIGxpZ2h0Z3JheTsNCiAgICBwYWRkaW5nOjNweDsNCiAgICB3aWR0aDoxNTBweDsNCn0NCiNNYXRjaGluZ0NVQ29kZXsNCmZvbnQtc2l6ZToxNDsNCmZvbnQtd2VpZ2h0OmJvbGQ7DQpjb2xvcjpncmVlbjsNCn0NCiNkZW1vQ29uZGl0aW9uc3sNCmJhY2tncm91bmQtY29sb3IgOiBncmVlbiA7DQpkaXNwbGF5Om5vbmU7DQp9DQoNCiNyZXBsYWNlVGFibGV7DQpkaXNwbGF5Om5vbmU7DQp9DQojY29uZmlybUJ1dHRvbnMsI3JlcGxhY2VCdXR0b25zLCNyZW1vdmVCdXR0b25zLCAjaW5zdGFsbEJ1dHRvbnN7DQpkaXNwbGF5Om5vbmU7DQptYXJnaW46MCAwIDIwIDAgOw0KfQ0KI25vdHsNCmRpc3BsYXk6bm9uZTsNCn0NCiNkZmNGZWF0dXJlc0ZvdW5kDQp7DQpjb2xvcjpncmVlbjsNCn0NCiN3b3JrZnVuY3Rpb25zew0KbWFyZ2luOjAgMCAzMCAwOw0KfQ0K");

geocortex.framework.notifyLibraryDownload("BarcodeScanner_Modules");
