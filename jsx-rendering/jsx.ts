const appendChild = (parent: HTMLElement, child: HTMLElement | string | number | null) => {
  if (child === null) {
    // dont do anything
  } else if (Array.isArray(child)) {
    child.forEach((nestedChild) => appendChild(parent, nestedChild))
  } else {
    console.log(child)
    const childType = typeof child
    parent.appendChild(
      ['string', 'number'].includes(childType) ? document.createTextNode(child.toString()) : child
    )
  }
}

const createFragment = (props: Record<string, string | Events> = {}, ...children: HTMLElement[]) => {
  return children
}

const createElement = (tag: string, props: Record<string, string | Events> = {}, ...children: Array<HTMLElement | string | number | null>) => {
  const element = document.createElement(tag)
  if (props) {
    Object.keys(props).forEach((name) => {
      const value = props[name]
      if (name.startsWith('on') && name.toLowerCase() in window) {
        if (typeof value === 'function') {
          const eventName: keyof HTMLElementEventMap = name.toLowerCase().substr(2) as any
          element.addEventListener(eventName, value)
        } else {
          console.error(`props '${name}' should be a function`)
        }
      }

      else element.setAttribute(name, value.toString())
    })
  }

  children.forEach((child) => {
    appendChild(element, child)
  })

  return element
}

type ValueOf<T> = T[keyof T];
type Events = ValueOf<HTMLElementEventMap>

class JSX {
  public static Fragment = 'Fragment'
  public static createElement = (tag: string | JSX.Fragment, props: Record<string, string | Events> = {}, ...children: HTMLElement[]) => {
    return tag === JSX.Fragment ? createFragment(props, ...children) : createElement(tag, props, ...children)
  }

}

export default JSX