export const attributeReflection = (constructor) => {
    if (Array.isArray(constructor.observedAttributes)) {
        return constructor.observedAttributes.reduce((currentConstructor, name) => {
            return class extends constructor {
                get [name]() {
                    return this.getAttribute(name);
                }
                set [name](value) {
                    this.setAttribute(name, value);
                }
            };
        }, constructor);
    }
    return constructor;
};
