import { createStore as __createStore__, applyMiddleware, compose as __compose__ } from 'redux'
import { symbols } from 'silhouette-core'

export default function({ compose, enhancers, middleware }){ 
    return {
        createStore: next => reducer => {
            let c = (compose || __compose__);
            let m = applyMiddleware(...(middleware || []));
            let e = c(...(enhancers || []), m);
            let i = r => Object.assign(next(r), __createStore__(r, e));
            return i(reducer);
        },
    }
};

function syncQueue(){
    let active = false;
    let next = { };
    let last = next;
    return {
        enqueue(action){
            last.value = action;
            last.next = { };
            last = last.next;
        },
        forEach(fun){
            if(active){ return };
            active = true;
            while(next.next){
                fun(next.value);
                next = next.next;
            }
            active = false;
        },
    }
};

export function useStore(store, reducer){
    return {
        createStore: next => reducer => {
            let dispatch = store.dispatch;
            let actionQueue = syncQueue();
            store.dispatch = action => {
                actionQueue.enqueue(action);
                actionQueue.forEach(dispatch);
            };
            store.replaceReducer(reducer);
            return store;
        },
        createSil: next => store => {
            let sil = next(store);
            sil.define(store.getState());
            return sil;
        },
        prototype: {
            dispatch: next => function(action){
                this[symbols.__root__][symbols.__reducers__].set([action.type], reducer);
                next.call(this, action);
            },
        }
    }
};

