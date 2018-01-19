import { Injectable, ComponentFactoryResolver, Type, ViewContainerRef, ComponentRef, ApplicationRef } from '@angular/core';
import { ModalComponent } from './../modal/modal.component';

export type InputType = { [index: string]: any };
export type OverlayFunction = () => void;

@Injectable()
export class ModalService {

    private showOverlay: OverlayFunction;
    private hideOverlay: OverlayFunction;

    constructor(private resolver: ComponentFactoryResolver, private applicationRef: ApplicationRef) { }

    private get viewContainerRef(): ViewContainerRef {
        const appInstance = this.applicationRef.components[0].instance;

        if (!appInstance.viewContainerRef) {
            const appName = this.applicationRef.componentTypes[0].name;
            throw new Error(`Missing 'viewContainerRef' declaration in ${appName} constructor`);
        }

        return appInstance.viewContainerRef;
    }

    public open<T>(component: Type<any>): Promise<T>;
    public open<T>(component: Type<any>, inputs: InputType): Promise<T>;
    public open<T>(component: Type<any>, inputs: InputType, width: string): Promise<T>;
    public open<T>(component: Type<any>, inputs?: InputType, width?: string, height?: string): Promise<T> {
        let componentRef;

        return new Promise<T>((mainResolve, mainReject) => {

            new Promise<T>((resolve, reject) => {

                setTimeout(() => {
                    const factory = this.resolver.resolveComponentFactory(ModalComponent);
                    componentRef = this.viewContainerRef.createComponent(factory);

                    componentRef.instance['injectComponent'] = {
                        component, inputs, resolve, reject
                    };
                    componentRef.instance.width = width;
                    componentRef.instance.height = height;
                    componentRef.instance.showOverlay = this.showOverlay;
                    componentRef.instance.hideOverlay = this.hideOverlay;
                }, 0);

            }).then((result: T) => {
                componentRef.destroy();
                mainResolve(result);
            }).catch(reason => {
                componentRef.destroy();
                mainReject(reason);
            });

        });
    }

    public setOverlay(showOverlay: OverlayFunction, hideOverlay: OverlayFunction) {
        this.showOverlay = showOverlay;
        this.hideOverlay = hideOverlay;
    }

}