const namedNodeMapToObject = (oldNameNodeMap) => {
    const oldAttributes = {};
    for (let i = 0; i < oldNameNodeMap.length; i++) {
        const attr = oldNameNodeMap.item(i);
        if (attr) {
            oldAttributes[attr.name] = attr.value;
        }
    }
    return oldAttributes;
};
const compareAttributes = (oldAttributes, newAttributes) => {
    const oldKeys = oldAttributes ? Object.keys(oldAttributes) : [];
    const newKeys = newAttributes ? Object.keys(newAttributes) : [];
    const output = {
        remove: [],
        set: {}
    };
    oldKeys.forEach((oldKey) => {
        const newKeyIndex = newKeys.indexOf(oldKey);
        if (newKeyIndex === -1) {
            output.remove.push(oldKey);
        }
        else {
            const oldValue = oldAttributes && oldAttributes[oldKey];
            const newValue = newAttributes && newAttributes[oldKey];
            newKeys.splice(newKeyIndex, 1);
            if (oldValue !== newValue) {
                if (newValue !== undefined) {
                    output.set[oldKey] = newValue;
                }
                else {
                    output.remove.push(oldKey);
                }
            }
        }
    });
    newKeys.forEach((newKey) => {
        const newValue = newAttributes && newAttributes[newKey];
        if (newValue !== undefined) {
            output.set[newKey] = newValue;
        }
        else {
            output.remove.push(newKey);
        }
    });
    return output;
};
class BaseHTMLElement extends HTMLElement {
    constructor() {
        super(...arguments);
        this.awaitUpdate = false;
        this.enableUpdate = false;
    }
    startUpdate() {
        if (this.awaitUpdate)
            return;
        if (!this.enableUpdate)
            return;
        this.awaitUpdate = true;
        window.requestAnimationFrame(() => this.update());
    }
    update() {
        this.awaitUpdate = false;
        if (!this.enableUpdate)
            return;
        // const newChildStructure = this.render()
        // if (this.childStructure) {
        //   this.updateChildStructure(newChildStructure)
        // } else {
        //   this.newChildStructure(newChildStructure)
        // }
        let children = this.render();
        if (children === null) {
            for (let i = 0; i < this.children.length; i++) {
                const item = this.children.item(i);
                if (item)
                    this.removeChild(item);
            }
        }
        else if (!Array.isArray(children)) {
            this.appendChild(children);
        }
        else
            (children.forEach((child) => {
                this.appendChild(child);
            }));
    }
    newChildStructure(childStructure) {
        this.childStructure = childStructure.reduce((arr, entry) => {
            arr.push(Object.assign(Object.assign({}, entry), { element: this.createChild(entry) }));
            return arr;
        }, []);
    }
    updateChildStructure(childStructure) {
        this.childStructure = childStructure.reduce((arr, entry, index) => {
            const oldEntry = this.childStructure && this.childStructure[index];
            if (oldEntry) {
                arr.push(Object.assign(Object.assign({}, entry), { element: this.updateChild(oldEntry, entry) }));
            }
            else {
                arr.push(Object.assign(Object.assign({}, entry), { element: this.createChild(entry) }));
            }
            return arr;
        }, []);
    }
    createChild(childStructure) {
        const element = document.createElement(childStructure.tag);
        element.innerText = childStructure.content || '';
        if (childStructure.attributes) {
            const attributes = childStructure.attributes;
            Object.keys(attributes).forEach((key) => {
                element.setAttribute(key, attributes[key]);
            });
        }
        this.appendChild(element);
        return element;
    }
    updateChild(oldChildStructure, newChildStructure) {
        const element = (() => {
            if (oldChildStructure.tag === newChildStructure.tag) {
                return oldChildStructure.element;
            }
            else {
                const parent = oldChildStructure.element.parentNode;
                parent === null || parent === void 0 ? void 0 : parent.removeChild(oldChildStructure.element);
                return document.createElement(newChildStructure.tag);
            }
        })();
        element.innerText = newChildStructure.content || '';
        const instructions = compareAttributes(namedNodeMapToObject(element.attributes), newChildStructure.attributes);
        instructions.remove.forEach((name) => {
            element.removeAttribute(name);
        });
        Object.keys(instructions.set).forEach((name) => {
            element.setAttribute(name, instructions.set[name]);
        });
        return element;
    }
    connectedCallback() {
        console.log('connectedCallback');
        this.enableUpdate = true;
        this.startUpdate();
    }
    attributeChangedCallback(name, oldValue, newValue) {
        console.log('attributeChangedCallback');
        this.startUpdate();
    }
    disconnectedCallback() {
        console.log('disconnectedCallback');
        this.enableUpdate = false;
    }
    adoptedCallback() {
    }
    render() {
        return null;
    }
}
export default BaseHTMLElement;
