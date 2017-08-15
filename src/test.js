import tap from 'tap'
import { create } from 'silhouette-core'
import reduxPlugin from './index.js'
const sil = create(reduxPlugin({
    state: { a: 3 }
}));

tap.test('rxjsPlugin tests', t => {
    t.true(sil);
    t.true(sil.a);
    t.end();
});