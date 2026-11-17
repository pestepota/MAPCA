export class Random {
    constructor(seed) {
        this.seed = this.hashSeed(seed);
    }

    //convert the seed to 32bit interger
    hashSeed(seed) {
        let hash = 2166136261;
        const text = String(seed);

        for (let i = 0; i < text.length; i++) {
            hash ^= text.charCodeAt(i);
            hash = Math.imul(hash, 16777619)
        }

        return hash >>> 0;
    }

    //make an pseudorandom number btwn 0 and 1
    next() {
        let t = this.seed += 0x6D2B79F5;

        t = Math.imul(t ^(t >>> 15), t | 1);
        t ^= t + Math.imul(t ^(t >>> 7), t | 61);

        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    //gen a number in a range
    range(min, max) {
        return min + this.next() * (max - min);
    }

    //gen an integer wth a range
    integer(min, max) {
        return Math.floor(this.range(min, max +1));
    }

    //select a rndom element from an array
    choice(array) {
        const index = this.integer(0, array.length - 1);

        return array[index];
    }
}