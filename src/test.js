import tap from 'tap'
import { create } from 'silhouette-core'
import reduxPlugin, { useStore } from './index.js'
import { createStore } from 'redux'

tap.test('reduxPlugin tests', t => {

    let i = 0;
    let sil = create(reduxPlugin({
        middleware: [ store => next => action => next({ type: ++i }) ],
    }));
    
    t.true(sil);
    
    sil.dispatch('stuff');

    t.same(i, 1);
    
    let store = createStore(i => i, { i: 'blue' });
    let s2 = create(useStore(store, i => i));
    t.true(s2.i);

    t.end();

});

