# **Redux Plugin for Silhouette**

This plugin embeds a configurable redux store into Silhouette. 

``` javascript
import { create }  from 'silhouette-core'
import reduxPlugin from 'silhouette-plugin-redux'

const sil = create(reduxPlugin({
    // all properties are optional
    enhancers: [],
    middleware: [],
    compose: function(...fs){ },
    state: {},
}));
```