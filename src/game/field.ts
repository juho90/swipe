import Chip from './chip';
import IItem from './item';

export default class Field {
    public chips: Chip[];

    constructor() {
        this.chips = [];
    }

    public add<T extends Chip = Chip>(chip: T, item: IItem): void {
        chip.hideAndKeep(item);
        this.chips.push(chip);
    }

    public detect<T extends Chip = Chip>(func: (chip: T) => void) {
        this.chips.forEach((value, index, array) => {
            func(value as T);
            if (value.item == null) {
                array.slice(index, 1);
            }
        });
    }

    public releaseAll(func: (item: IItem) => void): void {
        this.chips.forEach(element => {
            if (element.item == null) {
                return;
            }
            func(element.item);
        });
        this.chips = [];
    }
}