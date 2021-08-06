export class MapWithDefault<K, V> extends Map<K, V> {
    get(key: K): V {
        if (super.has(key)) {
            return super.get(key) as V;
        } else {
            const rv = this.defaultFunction(this);
            super.set(key, rv);
            return rv;
        }
    }

    constructor(
        private defaultFunction: (map: MapWithDefault<K, V>) => V,
        items?: readonly (readonly [K, V])[] | null,
    ) {
        super(items);
    }
}
