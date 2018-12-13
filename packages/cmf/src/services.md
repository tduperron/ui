# CMF service

Short version: It s the last piece to help developers to organize their code.

## Code organisation

When we talk about code organisation there are two schools:

by technical names, so app folders layout will be:

* components
* * User
* sagas
* * handleUser
* selectors
* * getUsers
* actions
* * addUser

or by feature then by technical names so it will be:

* service.user
* * actions/addUser
* * components/User
* * sagas/handleUser
* * selectors/getUsers

Services will contains selectors to read data, actionCreators, sagas and reducer to write datas and keep consistency. They can also contains dedicated components.

You can split the needs into the following categories:

* *rendering* (handled by components)
* *feature* aka calling APIs to communicate with the backend
* *data projection* into UI (transform backend data to fit component props, today handled by expressions / mapStateToProps)
* *user events effects* the user click in the UI which trigger effects (user -> event -> dispatch action -> saga -> dispact action -> reducer -> store -> render)

## A service is a configuration to put in cmf.bootstrap

It has dependencies and so must be setup as a service using cmf.bootstrap.

That means the index.js should only expose the configuration nothing else.

```javascript
import cmf from "@talend/react-cmf";
import user from './service.user';

cmf.bootstrap(cmf.module.merge(user, ..));
```


## How to create a service

A service should be a folder in your project / library with a feature name like `user`

The folder should contains one file or folder by technical names:

* actionCreators
* components
* sagas
* selectors

Then you give to cmf.bootstrap with the `services` key:

```javascript
import actionCreators from './actionCreators';
import components from './components';
import sagas from './sagas';
import selectors from './selectors';

const config = {
    actionCreators,
    sagas,
    saga, // main saga
    selectors,
};
// This will export a privatized config object ready for cmf.bootstrap
export default services.register('myservice', config);
```

## Dependency Injection / How to get a service

Do not import a service, let cmf give it to you. DI let you override when its needed some part of the code.

```javascript
import cmf from "@talend/react-cmf";

function test() {
    const user = cmf.services.get('user');
    // this is a very low level API
    const action = user.actionCreators.fetchAll();
    // ...
}
```

## Generated API in dedicated context

When you register a service you don t know where it will be used.
It can be used in different context:

* in a component
* in a selector
* in a saga

For this reason when you register a service cmf will add the following API to get a ready to use service in each context:

* cmf.services.get('user').inComponent(props) (the component must be cmfConnected)
* cmf.services.get('user').inSaga()
* cmf.services.get('user').inSelector(state)

Those accessors will just wrap each APIs to be usefull in this context.

If an API can't be applied it will not be available in the corresponding context. For example you can use a selector in the context of a component.

```javascript
// High level API
export function* mySaga() {
	const user = cmf.services.getSagas('user');
	const users = yield user.getAll();
}

export function MyComponent(props) {
	const user = cmf.services.get('user', { props });
    return <button onClick={user.fetchAll}>fetch all user</button>
}

export function myExpression({ context }) {
	const user = cmf.services.get('user', { context } );
	const users = user.getAll();
}
```

## Namespace and override

CMF main feature is DI so that means we can override any part of the code in the app.

The service name must be unique in an app. It will be used as prefix to register all corresponding apis.

So an actionCreator named 'getAll' in the 'user' service will be registred under 'actionCreators.service#user:getAll' in the CMF registry

to override during the bootstrap you can do the following:

```javascript
import cmf from '@talend/react-cmf';
import user from '@talend/iam';
import myapp from './cmfModule';

user.services.user.actionCreators.foo = myFunction
cmf.bootstrap(cmf.service.merge(user, myapp));
```

or in the app service:

```javascript
import user from '@talend/iam';

function getAll() {
    const action = user.services.user.getAll();
    action.cmf.routerPush = '/myuser/';
    return action;
}

export default {
    registry: {
        'service#user:getAll': getAll,
    },
    // is ===
    actionCreators: {
        'services#user:getAll': getAll,
    },
};
```
