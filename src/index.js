import { createStore as __createStore__, applyMiddleware, compose as __compose__ } from 'redux'

export default function({ compose, enhancers, middleware, state }){ 
    return {
        createStore(next, namespace){

            let c = (compose || __compose__);
            let m = applyMiddleware(...(middleware || []));
            let e = c(...(enhancers || []), m);
            let i = r => Object.assign(next(r), __createStore__(r, state || { }, e));
            let s = reducer => (state, action) => {
                return action.type === '@@redux/INIT' ? state : reducer(state, action); 
            }; 
            return reducer => i(s(reducer));

        },
        createSil(next, namespace){

            return store => {
                let sil = next(store);
                sil.define(state);
                return sil;
            }
            
        }
    }
};