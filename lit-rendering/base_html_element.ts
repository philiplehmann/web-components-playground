import { forEachChild } from "./node_modules/typescript/lib/typescript"

export type SetStateFunction = (oldState: Record<string, unknown>) => Record<string, unknown>
interface ChildStructure {
  tag: string
  attributes?: Record<string, string>
  childStructure?: ChildStructure[]
  content?: string
}

interface CreatedChildStructure extends ChildStructure {
  element: HTMLElement
}

const namedNodeMapToObject = (oldNameNodeMap: NamedNodeMap) => {
  const oldAttributes: Record<string, string> = {}
  for (let i = 0; i < oldNameNodeMap.length; i++) {
    const attr = oldNameNodeMap.item(i)
    if (attr) {
      oldAttributes[attr.name] = attr.value
    }
  }
  return oldAttributes
}

interface CompareAttributesOutput {
  remove: string[]
  set: Record<string, string>
}

const compareAttributes = (oldAttributes: Record<string, string> | undefined, newAttributes: Record<string, string> | undefined) => {
  const oldKeys = oldAttributes ? Object.keys(oldAttributes) : []
  const newKeys = newAttributes ? Object.keys(newAttributes) : []

  const output: CompareAttributesOutput = {
    remove: [],
    set: {}
  }
  oldKeys.forEach((oldKey) => {
    const newKeyIndex = newKeys.indexOf(oldKey)
    if (newKeyIndex === -1) {
      output.remove.push(oldKey)
    } else {
      const oldValue = oldAttributes && oldAttributes[oldKey]
      const newValue = newAttributes && newAttributes[oldKey]

      newKeys.splice(newKeyIndex, 1)

      if (oldValue !== newValue) {
        if (newValue !== undefined) {
          output.set[oldKey] = newValue
        } else {
          output.remove.push(oldKey)
        }
      }
    }
  })
  newKeys.forEach((newKey) => {
    const newValue = newAttributes && newAttributes[newKey]
    if (newValue !== undefined) {
      output.set[newKey] = newValue
    } else {
      output.remove.push(newKey)
    }
  })

  return output
}

class BaseHTMLElement extends HTMLElement {

  awaitUpdate = false
  enableUpdate = false
  childStructure?: CreatedChildStructure[]

  public startUpdate() {
    if (this.awaitUpdate) return
    if (!this.enableUpdate) return
    this.awaitUpdate = true
    window.requestAnimationFrame(() => this.update())
  }

  private update() {
    this.awaitUpdate = false
    if (!this.enableUpdate) return
    // const newChildStructure = this.render()
    // if (this.childStructure) {
    //   this.updateChildStructure(newChildStructure)
    // } else {
    //   this.newChildStructure(newChildStructure)
    // }
    let children = this.render()
    if (children === null) {
      for (let i = 0; i < this.children.length; i++) {
        const item = this.children.item(i)
        if (item) this.removeChild(item)
      }
    } else if (!Array.isArray(children)) {

      this.appendChild(children)
    } else (
      children.forEach((child) => {
        this.appendChild(child)
      })
    )
  }

  private newChildStructure(childStructure: ChildStructure[]) {
    this.childStructure = childStructure.reduce((arr: CreatedChildStructure[], entry: ChildStructure) => {
      arr.push({ ...entry, element: this.createChild(entry) })
      return arr
    }, [])
  }

  private updateChildStructure(childStructure: ChildStructure[]) {
    this.childStructure = childStructure.reduce((arr: CreatedChildStructure[], entry: ChildStructure, index) => {
      const oldEntry = this.childStructure && this.childStructure[index]
      if (oldEntry) {
        arr.push({ ...entry, element: this.updateChild(oldEntry, entry) })
      } else {
        arr.push({ ...entry, element: this.createChild(entry) })
      }
      return arr
    }, [])
  }

  private createChild(childStructure: ChildStructure): HTMLElement {
    const element = document.createElement(childStructure.tag)
    element.innerText = childStructure.content || ''
    if (childStructure.attributes) {
      const attributes = childStructure.attributes
      Object.keys(attributes).forEach((key) => {
        element.setAttribute(key, attributes[key])
      })
    }

    this.appendChild(element)
    return element
  }

  private updateChild(oldChildStructure: CreatedChildStructure, newChildStructure: ChildStructure): HTMLElement {
    const element: HTMLElement = (() => {
      if (oldChildStructure.tag === newChildStructure.tag) {
        return oldChildStructure.element
      } else {
        const parent = oldChildStructure.element.parentNode
        parent?.removeChild(oldChildStructure.element)
        return document.createElement(newChildStructure.tag)
      }
    })()
    element.innerText = newChildStructure.content || ''
    const instructions = compareAttributes(namedNodeMapToObject(element.attributes), newChildStructure.attributes)
    instructions.remove.forEach((name) => {
      element.removeAttribute(name)
    })
    Object.keys(instructions.set).forEach((name) => {
      element.setAttribute(name, instructions.set[name])
    })
    return element
  }

  connectedCallback() {
    console.log('connectedCallback')
    this.enableUpdate = true
    this.startUpdate()
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    console.log('attributeChangedCallback')
    this.startUpdate()
  }

  disconnectedCallback() {
    console.log('disconnectedCallback')
    this.enableUpdate = false
  }

  adoptedCallback() {

  }

  render(): JSX.Element | null {
    return null
  }
}

export default BaseHTMLElement