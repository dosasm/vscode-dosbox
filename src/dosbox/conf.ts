/**
 * Manage DOSBox's configuration file
 */
export class Conf {
    private _target: string[] = [];
    private eol = '\n';
    constructor(confStr: string) {
        if (confStr.includes('\r\n')) {
            this.eol = '\r\n';
        }
        this._target = confStr.split(this.eol);
        if (!Array.isArray(this._target)) {
            throw new Error('error target');
        }
    }
    has(section: string, key: string): number | undefined {
        let idx = this._target.findIndex(val => val.includes(`[${section}]`));
        while (idx < this._target.length) {
            const line = this._target[idx].trim().replace(/#.*/g, "");//remove comments
            const [_key, _value] = line.split("=");
            if (key.trim() === _key.trim()) {
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
            this._target[idx] = `${key} = ${value.toString()}`;
            return true;
        }
        return false;
    }

    updateAutoexec(context: string[]) {
        const section = '[autoexec]';
        const idx = this._target.findIndex(val => val === section);
        if (idx >= 0) {
            for (let i = idx + 1; i < this._target.length; i++) {
                if (!this._target[i].trim().startsWith('#')) {
                    this._target[i] = "#" + this._target[i];
                }
                if (this._target[i].trim().startsWith('[')) {
                    break;
                }
            }
            this._target.splice(idx + 1, 0, ...context);
        } else {
            this._target.push('[autoexec]', ...context);
        }
    }
    toString() {
        return this._target.join(this.eol);
    }
}