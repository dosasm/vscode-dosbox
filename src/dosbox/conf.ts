/**
 * Manage DOSBox's configuration file
 */
export class Conf {
    private _target: string[];
    constructor(private confStr: string) {
        this._target = confStr.split('\n');
    }
    has(section: string, key: string): number | undefined {
        let idx = this._target.findIndex(val => val.includes(section));
        while (idx < this._target.length) {
            const line = this._target[idx].trim().replace(/#.*/g, "");
            if (!line.startsWith('#') && line.includes(key)) {
                return idx;
            }
            idx++;
        }
        return undefined;
    }
    get(section: string, key: string) {
        const idx = this.has(section, key);
        if (idx !== undefined) {
            const [name, value] = this._target[idx].replace(/#.*/g, "").trim().split("=");
            if (value) {
                return value.trim();
            }
        }
    }
    update(section: string, key: string, value: boolean | number | string): boolean {
        const idx = this.has(section, key);
        if (idx !== undefined) {
            this._target[idx] = `${key} = ${value}`;
            return true;
        }
        return false;
    }
    toString() {
        return this._target.join("");
    }
}