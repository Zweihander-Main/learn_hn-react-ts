import * as React from 'react';
import FetchItems from './FetchItems';

export default class NewPage extends React.Component {
	render(): JSX.Element {
		return <FetchItems type={'new'} />;
	}
}
