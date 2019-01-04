import HttpErrorView from './components/HttpErrorView';
import actions from './actions/redirect';
import configure from './configure';
import saga from './sagas';

configure.initialize();

export default {
	id: 'cmf-http-error',
	components: { HttpErrorView },
	actionCreators: actions,
	saga,
};
