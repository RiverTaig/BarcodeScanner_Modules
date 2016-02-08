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
            this._selectedFeature.attributes["BARCODE"] = "IT WORKED!";
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
            //alert("adding feature");
            //return;
            var geom = this.getMapPointFromLatLong();
            var newgcxFeature = BarcodeScanner_TSModules.Utilities.createNewGcxFeature("Dx Non-Controllable Fitting", this.app.site, "Abandon", "Abandon", geom);
            var feature = newgcxFeature.esriFeature.get();
            feature.attributes["BARCODE"] = "Instaled!!"; //TODO update with actualy barcode 
            var layer = BarcodeScanner_TSModules.Utilities.getFeatureLayer("Dx Non-Controllable Fitting", this.app.site);
            //var mapService = Utilities.services.cBMobile.Utilities.LayerUtilities.getMapServiceByLayer(layer, this.app.site); //River Taig (commented)
            var mapService = BarcodeScanner_TSModules.Utilities.getMapServiceByLayer(layer, this.app.site); //River Taig
            var editDescriptor = {
                "mapService": mapService,
                "layer": layer,
                "feature": feature,
                "successCallback": function () {
                    console.log("editDescriptor successCallback");
                    _this.app.command("ShowFeatureDetails").execute(feature);
                },
                "errorCallback": function (error) {
                    alert("failed: " + error.message);
                }
            };
            this.app.command("CreateFeature").execute(editDescriptor); //River Taig
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