import * as React from 'react';
import queryString from 'query-string';
import { fetchItem, fetchComments } from '../utils/api';
import ItemMeta from './ItemMeta';
import { RouteComponentProps } from 'react-router-dom';

interface PostPageState {
	item: HNItem;
	comments: Array<HNItem>;
}

export default class PostPage extends React.Component<
	RouteComponentProps,
	Readonly<PostPageState>
> {
	state = {
		item: null,
		comments: null,
	};

	componentDidMount(): void {
		const { id } = queryString.parse(this.props.location.search);
		const numId = parseInt(id as string, 10);

		fetchItem(numId)
			.then((item) => {
				this.setState({ item });
				return fetchComments(item.kids || []);
			})
			.then((comments) =>
				this.setState({
					comments,
				})
			);
	}

	render(): JSX.Element {
		const { item, comments } = this.state;
		return (
			<React.Fragment>
				{item === null ? null : (
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
						{comments === null ? null : (
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
