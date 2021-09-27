interface ObservedHTMLElement {
  new(...args: any[]): HTMLElement;
  get observedAttributes(): string[] | undefined
}

export const attributeReflection = <T extends ObservedHTMLElement>(constructor: T) => {
  if (Array.isArray(constructor.observedAttributes)) {
    return constructor.observedAttributes.reduce((currentConstructor: T, name: string) => {
      return class extends constructor {
        get [name]() {
          return this.getAttribute(name)
        }

        set [name](value: string) {
          this.setAttribute(name, value)
        }
      }
    }, constructor)
  }
  return constructor
}
