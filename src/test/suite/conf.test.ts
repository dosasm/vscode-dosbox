import { Conf } from '../../dosbox/conf';
import * as assert from 'assert';

suite('dosbox conf test', () => {
    const conf = new Conf(`
    [section1]
    key1=1
    [SECTION2]
    key2=val2
    `);

    test('update conf', () => {
        conf.update("section1", "key1", "val1");
        assert.ok(conf.get("section1", "key1") === "val1", conf.toString());
    });
    test('update conf no key', () => {
        conf.update("section2", "key3", "val3");
        assert.ok(conf.get("section2", "key3"), "val3");
    });
    test('update conf no section no key', () => {
        conf.update("section3", "key4", "val4");
        assert.ok(conf.get("section3", "key4",), "val4");
    });
});