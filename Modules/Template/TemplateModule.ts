/// <reference path="../../Resources/Libs/Framework.d.ts" />
/// <reference path="../../Resources/Libs/Mapping.Infrastructure.d.ts" />
/// <reference path="../../utilities/utilities.ts" />
module BarcodeScanner_TSModules {

    export class TemplateModule extends geocortex.framework.application.ModuleBase 
    {
        //Git test
        public _testVariable = "";
        public _theApp = null;
        public _theMap = null;
        esriQuery: esri.tasks.Query = null;
        esriQueryTask: esri.tasks.QueryTask = null;
        private _selectedFeature: esri.Graphic = null;

        //private dxFeatureInGpsExtentmap: { [id: string]: esri.Graphic; } = {};
        //identifyTask: esri.tasks.IdentifyTask = null;
        //identifyParams: esri.tasks.IdentifyParameters = null;
        seGasExpressURL: string = "http://52.1.143.233/arcgis103/rest/services/Schneiderville/SEGasExpress/FeatureServer";
        //arrayUtils: dojo._base.array = null;

        fscHandle: string = null;
        private featureSetCollection: Observable<geocortex.essentialsHtmlViewer.mapping.infrastructure.FeatureSetCollection>;
        inventoryTable: any = null; //name needs to match config of <shell>.json.js file
        flagUri: string = null;
        app: geocortex.essentialsHtmlViewer.ViewerApplication;
        viewModel: TemplateModuleViewModel = null;
        _dxFeaturesInGPSExtentMap: { [id: number]: esri.Graphic; } = null;
        private _cuCodeAssociatedWithBarcode: string = "";
        private _graphic: esri.Graphic; // This is the magenta circle highlighting the selected element

        constructor(app: geocortex.essentialsHtmlViewer.ViewerApplication, lib: string) {
            super(app, lib);
            this.featureSetCollection = new Observable<geocortex.essentialsHtmlViewer.mapping.infrastructure.FeatureSetCollection>();
            this.featureSetCollection.bind(this, this._handleCollectionChanged);
            this._dxFeaturesInGPSExtentMap = {};
        }
        private _handleCollectionChanged(fsc: geocortex.essentialsHtmlViewer.mapping.infrastructure.FeatureSetCollection): void {
            console.log(fsc.countFeatures());

        }

        initialize(config: any): void {
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
            this.app.event("TemplateModuleViewModelAttached").subscribe(this, (model: TemplateModuleViewModel) => {
                this.viewModel = model;
            });


        }
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

        executeAffixBarcode2(): void
        {
            console.log("In execute affix barcode");

            var aFL = new esri.layers.FeatureLayer("http://52.1.143.233/arcgis103/rest/services/Schneiderville/SEGasExpress/Featureserver/5");
            
            //var updateGraphcics = [];
            var selectedValue = $("#featuresInExtent option:selected").val();
            var index: number = parseInt(selectedValue);
            var g = this._dxFeaturesInGPSExtentMap[index];
            var barcode = $("#txtScanText").val();
            g.attributes["BARCODE"] = barcode; //"set by River";
            //updateGraphcics.push(g);
            aFL.applyEdits(null, [g], null, () => {
                console.log("something");
            }, () => {
                console.log("error");
            });
        }


        executeAffixBarcode(FSCid: string): void {
            this._selectedFeature.attributes["BARCODE"] = "IT WORKED!";
            var layer = Utilities.getFeatureLayer("Dx Non-Controllable Fitting", this.app.site);
            //var mapService = Utilities.services.cBMobile.Utilities.LayerUtilities.getMapServiceByLayer(layer, this.app.site); //River Taig (commented)
            var mapService = Utilities.getMapServiceByLayer(layer, this.app.site); //River Taig
            var editDescriptor: any = {
                "mapService": mapService,
                "layer": layer,
                "feature": this._selectedFeature,
                "successCallback": () => {
                    console.log("editDescriptor successCallback");

                    var gcxFeature: geocortex.essentialsHtmlViewer.mapping.infrastructure.Feature = new geocortex.essentialsHtmlViewer.mapping.infrastructure.Feature({
                        "featureLayer": layer,
                        "graphic": this._selectedFeature
                    });
                    this.app.command("ShowFeatureDetails").execute(gcxFeature);
                },
                "errorCallback": (error: Error) => {
                    alert("failed: " + error.message);
                }
            };
            this.app.command("UpdateFeature").execute(editDescriptor);
        }


        addFeature(): void {
            //alert("adding feature");
            //return;
            var geom : esri.geometry.Point  = this.getMapPointFromLatLong();
            var newgcxFeature = Utilities.createNewGcxFeature("Dx Non-Controllable Fitting", this.app.site, "Abandon", "Abandon", geom);
            var feature = newgcxFeature.esriFeature.get();
            feature.attributes["BARCODE"] = "Instaled!!"; //TODO update with actualy barcode 
            var layer = Utilities.getFeatureLayer("Dx Non-Controllable Fitting", this.app.site);
            //var mapService = Utilities.services.cBMobile.Utilities.LayerUtilities.getMapServiceByLayer(layer, this.app.site); //River Taig (commented)
            var mapService = Utilities.getMapServiceByLayer(layer, this.app.site); //River Taig
            var editDescriptor: any = {
                "mapService": mapService,
                "layer": layer,
                "feature": feature,
                "successCallback": () => {
                    console.log("editDescriptor successCallback");
                    this.app.command("ShowFeatureDetails").execute(feature);
                },
                "errorCallback": (error: Error) => {
                    alert("failed: " + error.message);
                }
            };
            this.app.command("CreateFeature").execute(editDescriptor); //River Taig
        }
        apply(): void {
            alert("This will create or update a feature with the associated bar code: " +
                this.viewModel.code.get());
        }
        getMapPointFromLatLong(): esri.geometry.Point {
            
            var gpsPositionToZoomTo = this.viewModel.gpsPosition.get();
            
            var partsOfStr = gpsPositionToZoomTo.split(',');
            var  xlon :number  = + partsOfStr[1];
            var ylat : number = + partsOfStr[0];
            var num = xlon * 0.017453292519943295;
            var x = 6378137.0 * num;
            var a = ylat * 0.017453292519943295;
            var y = 3189068.5 * Math.log((1.0 + Math.sin(a)) / (1.0 - Math.sin(a)));
            return new esri.geometry.Point(x, y, this.app.map.spatialReference);
        }
        zoomToGPS(): void {
            //zoom to the gps position in the text box (may be a mocked position)
            var gpsPosition = $("#gpsPosition").val();
            //alert(gpsPosition);
            this.viewModel.gpsPosition.set(gpsPosition);
            var pnt: esri.geometry.Point = this.getMapPointFromLatLong();
            this.app.map.setExtent(new esri.geometry.Extent(pnt.x - 100, pnt.y - 100, pnt.x + 100, pnt.y + 100, this.app.map.spatialReference));
            this.drawGraphic(pnt);


            this.esriQueryTask = new esri.tasks.QueryTask("http://52.1.143.233/arcgis103/rest/services/Schneiderville/SEGasExpress/FeatureServer/5");
            this.esriQuery = new esri.tasks.Query();
            var mapPoint: esri.geometry.Point = this.getMapPointFromLatLong();
            var ext: esri.geometry.Extent = new esri.geometry.Extent(mapPoint.x - 10000, mapPoint.y - 10000, mapPoint.x + 10000, mapPoint.y + 10000, this.app.map.spatialReference);
            this.esriQuery.geometry = ext;
            this.esriQuery.returnGeometry = true;
            this.esriQuery.spatialRelationship = "esriSpatialRelIntersects";
            this.esriQuery.outFields = ["*"];
            //this.esriQueryTask.execute(this.esriQuery, this.showResults);
            //var temp = this.selectFeature();
            var that = this;
            this.esriQueryTask.execute(this.esriQuery, (results) => {

                this._dxFeaturesInGPSExtentMap = {};

                console.log("IN RESULTS");
                var counter: number = 0;
                for (var n = 0; n < results.features.length; n++) {
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
                    catch (ex) { }
                });
                $('#dfcFeaturesFound').text(counter.toString() + " Features found near current position");
                //that.selectFeature(that);

            });
            
        }
        
        drawCircle(pnt: esri.geometry.Point, context): void {
            if (typeof context == 'undefined'){
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

        }
        drawGraphic(pnt : esri.geometry.Point): void {
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
        }
        mockGPS(): void {
            //Pressing the mock button sets the gps position
            this.viewModel.gpsPosition.set("29.652098,-82.339335");//13th and University
        }
        mockScan(): void {
            //this.viewModel.code.set("ABC-019");
            //this.setFields("ABC-019");
            
            NextScan("");

            this.afterScan();

        }
        afterScan() {
            var barcode: any = $('#txtScanText').val();
            this._cuCodeAssociatedWithBarcode = "";
            this.viewModel.scanText = barcode;
            this.retrieveBarcodeMetaData(<string> barcode);
        }
        retrieveBarcodeMetaData(barcode: string) {
            $('#barcodeTable tbody').remove();
            this.esriQueryTask = new esri.tasks.QueryTask("http://52.1.143.233/arcgis103/rest/services/Schneiderville/SEGasExpress/FeatureServer/12");
            this.esriQuery = new esri.tasks.Query();
            this.esriQuery.where = "BARCODE = '" + barcode + "'";
            this.esriQuery.outFields = ["*"];
            
            this.esriQueryTask.execute(this.esriQuery, (results: esri.tasks.FeatureSet) => {
                for (var i : number = 0; i < results.features.length; i++)
                {
                    var gr: esri.Graphic = results.features[i];
                    var nameValPairs = gr.attributes["NameValuePairs"];
                    var nameValuePairArray = nameValPairs.split(',');
                    for (var j: number = 0; j < nameValuePairArray.length; j++) {
                        var nameValuePair: string = nameValuePairArray[j];
                        var nameAndValue = nameValuePair.split('|');
                        var appendString: string = "<tr><td>" + nameAndValue[0] + "</td ><td>" + nameAndValue[1] + "</td></tr>";
                        //alert(appendString);
                        $('#barcodeTable').append(appendString);
                        if (nameAndValue[0] == "CU-CODE") {
                            this._cuCodeAssociatedWithBarcode = nameAndValue[1];
                        }
                        //alert(nameValuePair);
                    }
                }
                //$('#myTable').append('<tr><td>my data</td><td>more data</td></tr>');
                this.selectTextInOptions();
            });

            //Now lets fine out if any values in the select options have a matching CUCode

            

        }
        
        //This selects the text in the option, and then calls selectFeature which will actually cause a zoom and a highlight circle.
        selectTextInOptions() {
            var text: string = this._cuCodeAssociatedWithBarcode;

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
            
        }
        setFields(scanResult: string): void {
            var inventoryRecord: any = this.inventoryTable[scanResult];
            //this.viewModel.field1.set(inventoryRecord.field1);
            //this.viewModel.field2.set(inventoryRecord.field2);
        }

        //selectFeature is triggered when the user selects an option in the select box. The feature is zoomed to and a pink circle is drawn
        selectFeature(context): void {
            if (typeof context == 'undefined') {
                context = this;
            }
            context._dxFeaturesInGPSExtentMap = _jsVariable;
            var selectedValue = $("#featuresInExtent option:selected").val();
            var index: number = parseInt(selectedValue);
            context._selectedFeature = context._dxFeaturesInGPSExtentMap[index];
            var pnt: esri.geometry.Point;
            pnt = <esri.geometry.Point> context._selectedFeature.geometry;
            var ext: esri.geometry.Extent = new esri.geometry.Extent(pnt.x - 50, pnt.y - 50, pnt.x + 50, pnt.y + 50, context.app.map.spatialReference);
            context.app.map.setExtent(ext);
            console.log(context._selectedFeature.geometry.type);
            context.drawCircle(pnt);
        }
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
        executeScan(): void {
            //alert("About to scan - 124");
            try {

                this.app.command("LaunchBarcodeScannerWithCallback").execute((scanResult: any) => {
;
                    var s = (JSON.stringify(scanResult));
                    //alert(s);
                    if (scanResult.status == "Success") {
                        NextScan(scanResult.content.toString());
                        this.afterScan();
                    }
                    else {
                        alert("An error occurred: " + scanResult.status);
                        //alert("ooops");
                        //this.viewModel.codeFound.set(false);
                    }
                });
            }
            catch (Exception) {
                //alert("Oops");

            }
        }

    }
}
var _jsVariable;