import * as React from 'react';
import ItemList from './ItemList';
import Loading from './Loading';
import { fetchMainPosts } from '../utils/api';
import Helmet from 'react-helmet';

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
	state = {
		items: null,
		error: null,
		loading: true,
	};

	componentDidMount(): void {
		this.handleFetch();
	}

	componentDidUpdate(prevProps): void {
		if (prevProps.type !== this.props.type) {
			this.handleFetch();
		}
	}

	handleFetch = (): void => {
		this.setState({
			items: null,
			error: null,
			loading: true,
		});

		const { type } = this.props;

		fetchMainPosts(type)
			.then((items: Array<HNItem>): void => {
				this.setState({ items, error: null, loading: false });
			})
			.catch(({ message }: { message: string }): void =>
				this.setState({
					error: message,
					loading: false,
				})
			);
	};

	render(): JSX.Element | JSX.Element[] {
		const { items, error, loading } = this.state;
		const { type } = this.props;

		const title = `${type[0].toUpperCase() +
			type.slice(1).toLowerCase()} Stories`;
		const titleJSX = (
			<Helmet key={`title-${title}`}>
				<title>{title}</title>
			</Helmet>
		);

		if (loading === true) {
			return [titleJSX, <Loading key={`loading-${title}`} />];
		}

		if (error) {
			return [
				titleJSX,
				<p key={`error-${title}`} className="center-text error">
					{error}
				</p>,
			];
		}

		return [titleJSX, <ItemList key={`items-${title}`} items={items} />];
	}
}
