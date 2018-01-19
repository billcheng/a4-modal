# a4-modal
Angular 4 Modal

# How-To
## Install
```
npm install a4-modal
```

## app.module.ts
1. Add ```ModalModule``` to imports of the ```app.module.ts```.

```typescript

...
import { ModalModule } from 'a4-modal';
...

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    ...,
    ModalModule,
    ...
  ],
  ...
})
```

## app.component.ts
1. Add ```viewContainerRef: ViewContainerRef``` to the constructor of ```app.component.ts```.
```typescript
...
import { ViewContainerRef } from '@angular/core';
...

constructor(private viewContainerRef: ViewContainerRef) { }
```

## your.component.ts
1. Add ```modalService: ModalService``` to the constructor of your component.
```typescript
constructor(private modalService: ModalService) { }
```
1. Invoking the modal can be done by using the service as shown below.
```typescript
this.modalService.open(MyModalContentComponent)
    .then(p=> console.log(p)) // the result of the modal
    .catch(p=> console.error(p)); // when route changes
```

1. ```MyModalContentComponent``` will be dynamically created by the modal service. You will need to add ```MyModalContentComponent``` to the ```entryComponents``` in your module.
```typescript
@NgModule({
    imports: [
        ...
    ],
    declarations: [
        ...
    ],
    providers: [
        ...
    ],
    entryComponents: [
        MyModalContentComponent
    ]
```

## my-modal.component.ts
1. The service will automatically inject the modal component into your component.
1. Add the following code to your modal component.
```typescript
...
import { ModalComponent, IModal } from 'a4-modal';
...

export class MyModalComponent implements IModal {
    ...
    modal: ModalComponent;
    ...

    closeModal() {
        this.modal.close();
    }

    ...
}
```