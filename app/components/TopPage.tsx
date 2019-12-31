import * as React from 'react';
import FetchItems from './FetchItems';

export default class TopPage extends React.Component {
	render(): JSX.Element {
		return <FetchItems type={'top'} />;
	}
}
