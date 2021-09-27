const appendChild = (parent, child) => {
    if (child === null) {
        // dont do anything
    }
    else if (Array.isArray(child)) {
        child.forEach((nestedChild) => appendChild(parent, nestedChild));
    }
    else {
        console.log(child);
        const childType = typeof child;
        parent.appendChild(['string', 'number'].includes(childType) ? document.createTextNode(child.toString()) : child);
    }
};
const createFragment = (props = {}, ...children) => {
    return children;
};
const createElement = (tag, props = {}, ...children) => {
    const element = document.createElement(tag);
    if (props) {
        Object.keys(props).forEach((name) => {
            const value = props[name];
            if (name.startsWith('on') && name.toLowerCase() in window) {
                if (typeof value === 'function') {
                    const eventName = name.toLowerCase().substr(2);
                    element.addEventListener(eventName, value);
                }
                else {
                    console.error(`props '${name}' should be a function`);
                }
            }
            else
                element.setAttribute(name, value.toString());
        });
    }
    children.forEach((child) => {
        appendChild(element, child);
    });
    return element;
};
class JSX {
}
JSX.Fragment = 'Fragment';
JSX.createElement = (tag, props = {}, ...children) => {
    return tag === JSX.Fragment ? createFragment(props, ...children) : createElement(tag, props, ...children);
};
export default JSX;
