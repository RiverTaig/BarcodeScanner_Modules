/// <reference path="../../Resources/Libs/Framework.d.ts" />
/// <reference path="../../Resources/Libs/Mapping.Infrastructure.d.ts" />

module BarcodeScanner_TSModules {

    export class TemplateModuleViewModel extends geocortex.framework.ui.ViewModelBase {

        app: geocortex.essentialsHtmlViewer.ViewerApplication;
        code: Observable<string> = new Observable<string>();
        showCodeNotFound: Observable<boolean> = new Observable<boolean>();
        codeFound: Observable<boolean> = new Observable<boolean>(true);
        scanText: Observable<string> = new Observable<string>();
        gpsPosition: Observable<string> = new Observable<string>();

        constructor(app: geocortex.essentialsHtmlViewer.ViewerApplication, lib: string) {
            super(app, lib);
        }

        initialize(config: any): void {

            this.codeFound.bind(this, (value: boolean) => {
                this.showCodeNotFound.set(!value);
            });

        }

    }
}