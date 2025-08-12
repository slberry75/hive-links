export function getRandomEntry<T> (array: T[]) {
    if (array.length === 0)
        throw new RangeError('Cannot retrieve random entry from empty array');

    return array[Math.floor(Math.random() * array.length)];
}