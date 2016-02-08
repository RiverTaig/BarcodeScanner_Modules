/// <reference path="../Libs/Framework.d.ts" />
/// <reference path="../Libs/Mapping.Infrastructure.d.ts" />
declare module BarcodeScanner_TSModules {
    class Utilities {
        static createNewGcxFeature(layerName: string, site: geocortex.essentials.Site, type?: string, templateName?: string, geometry?: esri.geometry.Geometry): geocortex.essentialsHtmlViewer.mapping.infrastructure.Feature;
        static getFeatureService(layerName: string, site: geocortex.essentials.Site): esri.layers.FeatureLayer;
        static getFeatureLayer(name: string, site: geocortex.essentials.Site): esri.layers.FeatureLayer;
        static getEssentialsLayer(name: string, site: geocortex.essentials.Site): geocortex.essentials.Layer;
        static getMapServiceByLayer(layer: esri.layers.Layer, site: geocortex.essentials.Site): geocortex.essentials.MapService;
        static findMapServiceByMap(map: esri.Map, serviceId: string): esri.layers.Layer;
    }
}
declare module BarcodeScanner_TSModules {
    class TemplateModule extends geocortex.framework.application.ModuleBase {
        _testVariable: string;
        _theApp: any;
        _theMap: any;
        esriQuery: esri.tasks.Query;
        esriQueryTask: esri.tasks.QueryTask;
        private _selectedFeature;
        seGasExpressURL: string;
        fscHandle: string;
        private featureSetCollection;
        inventoryTable: any;
        flagUri: string;
        app: geocortex.essentialsHtmlViewer.ViewerApplication;
        viewModel: TemplateModuleViewModel;
        _dxFeaturesInGPSExtentMap: {
            [id: number]: esri.Graphic;
        };
        private _cuCodeAssociatedWithBarcode;
        private _graphic;
        constructor(app: geocortex.essentialsHtmlViewer.ViewerApplication, lib: string);
        private _handleCollectionChanged(fsc);
        initialize(config: any): void;
        executeAffixBarcode2(): void;
        executeAffixBarcode(FSCid: string): void;
        addFeature(): void;
        apply(): void;
        getMapPointFromLatLong(): esri.geometry.Point;
        zoomToGPS(): void;
        drawCircle(pnt: esri.geometry.Point, context: any): void;
        drawGraphic(pnt: esri.geometry.Point): void;
        mockGPS(): void;
        mockScan(): void;
        afterScan(): void;
        retrieveBarcodeMetaData(barcode: string): void;
        selectTextInOptions(): void;
        setFields(scanResult: string): void;
        selectFeature(context: any): void;
        executeScan(): void;
    }
}
declare var _jsVariable: any;
declare module BarcodeScanner_TSModules {
    class TemplateModuleView extends geocortex.framework.ui.ViewBase {
        app: geocortex.essentialsHtmlViewer.ViewerApplication;
        constructor(app: geocortex.essentialsHtmlViewer.ViewerApplication, lib: string);
        attach(viewModel?: TemplateModuleViewModel): void;
    }
}
declare var gpsMockIndex: number;
declare var scanMockIndex: number;
declare var foundToggle: boolean;
declare function NextGpsPosition(): void;
declare function ZoomToMyFeature(): void;
declare function NextScan(codeFromScanner: any): void;
declare function ApplyDemoConditions(): void;
declare function ToggleDemoConditions(): void;
declare module BarcodeScanner_TSModules {
    class TemplateModuleViewModel extends geocortex.framework.ui.ViewModelBase {
        app: geocortex.essentialsHtmlViewer.ViewerApplication;
        code: Observable<string>;
        showCodeNotFound: Observable<boolean>;
        codeFound: Observable<boolean>;
        scanText: Observable<string>;
        gpsPosition: Observable<string>;
        constructor(app: geocortex.essentialsHtmlViewer.ViewerApplication, lib: string);
        initialize(config: any): void;
    }
}
