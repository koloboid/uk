export function Cached(proto: any, prop: string) {
    const get = Object.getOwnPropertyDescriptor(proto, prop)?.get;
    const symName = proto.constructor.name + '.' + prop;
    if (!get) throw new Error(`Property ${symName} not found. @CachedProp can be used only on defined getters`);
    const sym = Symbol(symName);
    Object.defineProperty(proto, prop, {
        get() {
            if (sym in this) return this[sym];
            return (this[sym] = get.call(this));
        },
    });
}

export function RequiredConst<T>(setter?: (self: any, val: T) => T) {
    return function (proto: any, prop: string) {
        const symName = proto.constructor.name + '.' + prop;
        const sym = Symbol.for(symName);
        Object.defineProperty(proto, prop, {
            get() {
                const val = this[sym];
                if (val === undefined || val === null)
                    throw new Error(`Trying to get RequiredConst ${symName}, but got ${val}`);
                return val;
            },
            set(val: any) {
                if (val === null || val === undefined) return;
                if (this[sym] === undefined) {
                    this[sym] = setter ? setter(this, val) : val;
                } else throw new Error(`Trying to set RequiredConst ${symName}, while it already has a value`);
            },
        });
    };
}

export function RequiredProp<T>(setter?: (self: any, val: T) => T) {
    return function (proto: any, prop: string) {
        const symName = proto.constructor.name + '.' + prop;
        const sym = Symbol.for(symName);
        Object.defineProperty(proto, prop, {
            get() {
                const val = this[sym];
                if (val === undefined || val === null)
                    throw new Error(`Trying to get RequiredConst ${symName}, but got ${val}`);
                return val;
            },
            set(val: any) {
                if (val === null || val === undefined) return;
                this[sym] = setter ? setter(this, val) : val;
            },
        });
    };
}

export function HasProp(propName: string) {
    return function (proto: any, prop: string) {
        const symName = proto.constructor.name + '.' + propName;
        const sym = Symbol.for(symName);
        Object.defineProperty(proto, prop, {
            get() {
                const val = this[sym];
                return val !== undefined && val !== null;
            },
        });
    };
}
