var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import JSX from './jsx.js';
import { attributeReflection } from './delegators.js';
import BaseHTMLElement from './base_html_element.js';
if (!customElements.get('pl-component')) {
    let PLComponent = class PLComponent extends BaseHTMLElement {
        constructor() {
            super(...arguments);
            this.number = 0;
            this.renderedFrames = 0;
            this.framesPerSecond = 0;
        }
        static get observedAttributes() { return ['name']; }
        connectedCallback() {
            super.connectedCallback();
            this.interval = setInterval(() => {
                this.number = this.number + 1;
                this.startUpdate();
            }, 1);
            this.framesSecondInterval = setInterval(() => {
                this.framesPerSecond = this.renderedFrames;
                this.renderedFrames = 0;
                this.startUpdate();
            }, 1000);
        }
        disconnectedCallback() {
            super.disconnectedCallback();
            clearInterval(this.interval);
            clearInterval(this.framesSecondInterval);
        }
        render() {
            this.renderedFrames = this.renderedFrames + 1;
            // return [
            //   {
            //     tag: 'div',
            //     content: `Hello ${this.name}`,
            //   },
            //   {
            //     tag: 'div',
            //     content: `number: ${this.number}`,
            //   },
            //   {
            //     tag: 'div',
            //     content: `fps: ${this.framesPerSecond}`,
            //   }
            // ]
            return JSX.createElement(JSX.Fragment, null,
                JSX.createElement("div", null,
                    "Hello ",
                    this.name),
                JSX.createElement("div", null,
                    "number: ",
                    this.number),
                JSX.createElement("div", null,
                    "fps: ",
                    this.framesPerSecond));
        }
    };
    PLComponent = __decorate([
        attributeReflection
    ], PLComponent);
    customElements.define('pl-component', PLComponent);
}
