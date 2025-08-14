export function getRandomEntry<T> (array: T[]):null | T {
    if (array.length === 0)
        throw new RangeError('Cannot retrieve random entry from empty array');

    return array[Math.floor(Math.random() * array.length)];
}
export function shuffleArray(array:any[]):any {
  let currentIndex = array.length;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {

    // Pick a remaining element...
    let randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
}