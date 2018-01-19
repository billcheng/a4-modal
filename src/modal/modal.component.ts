import {
  Component, OnInit, Input, Type, ViewContainerRef, ComponentFactoryResolver, ComponentRef, ViewChild,
  HostBinding, HostListener, AnimationTransitionEvent, ChangeDetectionStrategy, OnDestroy
} from '@angular/core';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { InputType, OverlayFunction } from '../service/modal.service';
import 'rxjs/add/operator/filter';

export interface InjectComponent {
  component: Type<any>;
  inputs: InputType;
  resolve: (value?: any | PromiseLike<any>) => void;
  reject: (reason?: any) => void;
}

export interface IModal {
  modal: ModalComponent;
}

@Component({
  selector: 'a4-modal',
  template: `<ng-template #container></ng-template>`,
  styles: [`
  :host {
    display: block;
    position: fixed;
    z-index: 1000;
    background-color: white;
    left: 50vw;
    top: 50vh;
    border: 1px solid rgba(0,0,0,0.1);
    border-radius: 4px;
    box-shadow: 0 5px 5px -3px rgba(0,0,0,.2), 0 8px 10px 1px rgba(0,0,0,.14), 0 3px 14px 2px rgba(0,0,0,.12);
  }
  `],
  animations: [
    trigger('scaling', [
      state('0', style({ transform: 'translate(-50%, -50%) scale(0)' })),
      state('1', style({ transform: 'translate(-50%, -50%) scale(1)' })),
      transition(':enter', [style({ transform: 'translate(-50%, -50%) scale(0)' }), animate('250ms ease')]),
      transition('1 => 0', animate('250ms ease'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ModalComponent implements OnInit, OnDestroy {

  @Input() injectComponent: InjectComponent;
  @Input() width: string;
  @Input() height: string;
  @Input() showOverlay: OverlayFunction;
  @Input() hideOverlay: OverlayFunction;
  @ViewChild('container', { read: ViewContainerRef }) viewContainerRef: ViewContainerRef;
  @HostBinding('@scaling') scaling = false;
  @HostBinding('style.width') hostWidth: string;
  @HostBinding('style.height') hostHeight: string;
  componentRef: ComponentRef<any>;
  result: any;
  subscription: Subscription;

  constructor(private resolver: ComponentFactoryResolver,
    private router: Router) { }

  ngOnInit() {
    if (!!this.width) {
      this.hostWidth = this.width;
    }

    if (!!this.height) {
      this.hostHeight = this.height;
    }

    const factory = this.resolver.resolveComponentFactory(this.injectComponent.component);
    this.componentRef = this.viewContainerRef.createComponent(factory);

    if (!!this.injectComponent.inputs) {
      Object.keys(this.injectComponent.inputs)
        .forEach(key => this.componentRef.instance[key] = this.injectComponent.inputs[key]);
    }
    this.componentRef.instance.modal = this;

    this.scaling = true;

    this.subscription = this.router.events
      .filter(p => p instanceof NavigationStart)
      .subscribe(() => {
        this.componentRef.destroy();
        this.injectComponent.reject();
      });

    if (this.showOverlay) {
      this.showOverlay();
    }
  }

  ngOnDestroy() {
    if (this.hideOverlay) {
      this.hideOverlay();
    }
    this.subscription.unsubscribe();
  }

  close<T>(result: T) {
    this.result = result;
    this.scaling = false;
  }

  @HostListener('@scaling.done', ['$event'])
  animationDone(e: AnimationTransitionEvent) {
    if (!e.toState) {
      this.injectComponent.resolve(this.result);
      this.componentRef.destroy();
    }
  }

}