import * as React from 'react';
import ItemList from './ItemList';
import { fetchMainPosts } from '../utils/api';

interface FetchItemsProps extends React.Props<FetchItems> {
	type: HNTypes;
}

interface FetchItemsState {
	items: Array<HNItem>;
}

export default class FetchItems extends React.Component<
	FetchItemsProps,
	Readonly<FetchItemsState>
> {
	constructor(props: FetchItemsProps) {
		super(props);
		this.state = {
			items: null,
		};
	}

	componentDidMount(): void {
		const { type } = this.props;
		fetchMainPosts(type).then((items: Array<HNItem>): void =>
			this.setState({ items })
		);
	}

	render(): JSX.Element {
		const { items } = this.state;
		return <ItemList items={items} />;
	}
}
