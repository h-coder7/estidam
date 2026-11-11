export const REVALIDATE_MS = 300_000;
// export const REVALIDATE_MS = 10_000;

type Entry<T> = {
    value: T;
    freshUntil: number;
    refreshing?: Promise<void>;
};

export function createSwrCache<T>(fallback: T) {
    const store = new Map<string, Entry<T>>();

    return async function load(key: string, fetchValue: () => Promise<T | null>): Promise<T> {
        const hit = store.get(key);
        const now = Date.now();

        if (hit && now < hit.freshUntil) return hit.value;

        if (hit) {
            if (!hit.refreshing) {
                hit.refreshing = fetchValue()
                    .then((value) => {
                        store.set(key, {
                            value: value ?? hit.value,
                            freshUntil: Date.now() + REVALIDATE_MS,
                        });
                    })
                    .finally(() => {
                        const current = store.get(key);
                        if (current) delete current.refreshing;
                    });
            }

            return hit.value;
        }

        const value = await fetchValue();
        const stored = value ?? fallback;
        store.set(key, { value: stored, freshUntil: Date.now() + REVALIDATE_MS });
        return stored;
    };
}
