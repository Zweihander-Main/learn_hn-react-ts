import * as React from 'react';
import queryString from 'query-string';
import { fetchItem, fetchComments } from '../utils/api';
import ItemMeta from './ItemMeta';
import Loading from './Loading';
import { RouteComponentProps } from 'react-router-dom';

interface PostPageState {
	item: HNItem;
	comments: Array<HNItem>;
	loadingPost: boolean;
	loadingComments: boolean;
	error: string;
}

export default class PostPage extends React.Component<
	RouteComponentProps,
	Readonly<PostPageState>
> {
	state = {
		item: null,
		comments: null,
		loadingPost: true,
		loadingComments: true,
		error: null,
	};

	componentDidMount(): void {
		const { id } = queryString.parse(this.props.location.search);
		const numId = parseInt(id as string, 10);

		fetchItem(numId)
			.then(
				(item): Promise<Array<HNItem>> => {
					this.setState({ item, loadingPost: false });
					return fetchComments(item.kids || []);
				}
			)
			.then((comments): void =>
				this.setState({
					comments,
					loadingComments: false,
				})
			)
			.catch(({ message }: { message: string }): void =>
				this.setState({
					error: message,
					loadingPost: false,
					loadingComments: false,
				})
			);
	}

	render(): JSX.Element {
		const {
			item,
			comments,
			loadingPost,
			loadingComments,
			error,
		} = this.state;

		if (error) {
			return <p className="center-text error">{error}</p>;
		}

		return (
			<React.Fragment>
				{loadingPost === true ? (
					<Loading text="Fetching post" />
				) : (
					<React.Fragment>
						<h1 className="header">
							<a className="link" href={item.url}>
								{item.title}
							</a>
						</h1>
						<ItemMeta
							by={item.by}
							time={item.time}
							id={item.id}
							descendants={item.descendants}
						/>
						<p dangerouslySetInnerHTML={{ __html: item.text }} />
						{loadingComments === true ? (
							loadingPost === false && (
								<Loading text="Fetching comments" />
							)
						) : (
							<React.Fragment>
								{comments.map((comment: HNItem) => (
									<div key={comment.id} className="comment">
										<ItemMeta
											by={comment.by}
											time={comment.time}
											id={comment.id}
										/>
										<p
											dangerouslySetInnerHTML={{
												__html: comment.text,
											}}
										/>
									</div>
								))}
							</React.Fragment>
						)}
					</React.Fragment>
				)}
			</React.Fragment>
		);
	}
}
