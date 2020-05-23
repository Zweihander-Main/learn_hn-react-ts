import * as React from 'react';
import { HNTypes as propTypesHNTypes } from '../globals.PropTypes';
import ItemList from './ItemList';
import Loading from './Loading';
import { fetchMainPosts } from '../utils/api';
import { Helmet } from 'react-helmet';

interface ItemsPageProps extends React.Props<ItemsPage> {
	type: HNTypes;
}

interface ItemsPageState {
	items: Array<HNItem>;
	error: string;
	loading: boolean;
}

/**
 * Fetches a list of posts for the given post type and renders a page listing
 * those posts
 *
 * @class      ItemsPage
 */
export default class ItemsPage extends React.Component<
	ItemsPageProps,
	ItemsPageState
> {
	static propTypes = {
		type: propTypesHNTypes.isRequired,
	};

	state: ItemsPageState = {
		items: null,
		error: null,
		loading: true,
	};

	componentDidMount(): void {
		this.handleFetch();
	}

	componentDidUpdate(prevProps: ItemsPageProps): void {
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

	render(): React.ReactNode | React.ReactNode[] {
		const { items, error, loading } = this.state;
		const { type } = this.props;

		const title = `${
			type[0].toUpperCase() + type.slice(1).toLowerCase()
		} Stories`;
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
