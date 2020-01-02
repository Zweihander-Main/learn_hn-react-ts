import * as React from 'react';
import ItemList from './ItemList';
import Loading from './Loading';
import { fetchMainPosts } from '../utils/api';

interface FetchItemsProps extends React.Props<FetchItems> {
	type: HNTypes;
}

interface FetchItemsState {
	items: Array<HNItem>;
	error: string;
	loading: boolean;
}

export default class FetchItems extends React.Component<
	FetchItemsProps,
	Readonly<FetchItemsState>
> {
	constructor(props: FetchItemsProps) {
		super(props);
		this.state = {
			items: null,
			error: null,
			loading: true,
		};
	}

	componentDidMount(): void {
		const { type } = this.props;
		fetchMainPosts(type)
			.then((items: Array<HNItem>): void =>
				this.setState({ items, error: null, loading: false })
			)
			.catch(({ message }: { message: string }): void =>
				this.setState({
					error: message,
					loading: false,
				})
			);
	}

	render(): JSX.Element {
		const { items, error, loading } = this.state;

		if (loading === true) {
			return <Loading />;
		}

		if (error) {
			return <p className="center-text error">{error}</p>;
		}

		return <ItemList items={items} />;
	}
}
