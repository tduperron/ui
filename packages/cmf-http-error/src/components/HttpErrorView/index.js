import { cmfConnect } from '@talend/react-cmf';
import HttpErrorView from './HttpErrorView.component';

export default cmfConnect({
	omitCMFProps: true,
	withComponentRegistry: true,
	withDispatch: true,
	withDispatchActionCreator: true,
	withComponentId: true,
})(HttpErrorView);
