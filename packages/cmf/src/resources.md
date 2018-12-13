# Resources

This API let you create a standalone service to query a resource on a backend.


```javascript
// myresource.js
import cmf from '@talend/react-cmf';

cmf.bootstrap({
    resources: [{
        id: 'user',
        API_URL: '/api/v1/users'
    }],
})

// So then you can do the following
function* mysaga() {
    const user = cmf.resources.get('user');
    yield user.createEffect({ name: 'My user name'});
}
```
