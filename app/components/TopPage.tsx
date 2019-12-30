import * as React from 'react';
import FetchItems from './FetchItems';

export default class Top extends React.Component {
	render(): JSX.Element {
		return <FetchItems type={'top'} />;
	}
}
