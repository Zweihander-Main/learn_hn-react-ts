import * as React from 'react';
import ItemList from './ItemList';
import { fetchMainPosts } from '../utils/api';

interface TopState {
	items: Array<HNItem>;
}

export default class Top extends React.Component<{}, Readonly<TopState>> {
	constructor(props: {}) {
		super(props);
		this.state = {
			items: null,
		};
	}

	componentDidMount(): void {
		fetchMainPosts('top').then((items: Array<HNItem>): void =>
			this.setState({ items })
		);
	}

	render(): JSX.Element {
		const { items } = this.state;
		return <ItemList items={items} />;
	}
}
