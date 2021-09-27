import JSX from './jsx.js'
import { attributeReflection } from './delegators.js'
import BaseHTMLElement from './base_html_element.js'

if (!customElements.get('pl-component')) {
  @attributeReflection
  class PLComponent extends BaseHTMLElement {
    static get observedAttributes() { return ['name'] }

    name?: string
    interval?: number
    framesSecondInterval?: number
    number = 0
    renderedFrames = 0
    framesPerSecond = 0

    connectedCallback() {
      super.connectedCallback()
      this.interval = setInterval(() => {
        this.number = this.number + 1
        this.startUpdate()
      }, 1)
      this.framesSecondInterval = setInterval(() => {
        this.framesPerSecond = this.renderedFrames
        this.renderedFrames = 0
        this.startUpdate()
      }, 1000)
    }

    disconnectedCallback() {
      super.disconnectedCallback()
      clearInterval(this.interval)
      clearInterval(this.framesSecondInterval)
    }

    render() {
      this.renderedFrames = this.renderedFrames + 1
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
      return <>
        <div>Hello {this.name}</div>
        <div>number: {this.number}</div>
        <div>fps: {this.framesPerSecond}</div>
      </>
    }
  }

  customElements.define('pl-component', PLComponent)
}