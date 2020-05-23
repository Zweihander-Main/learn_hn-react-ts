import * as React from 'react';
import * as PropTypes from 'prop-types';

const styles: { content: React.CSSProperties } = {
	content: {
		fontSize: '35px',
		marginTop: '20px',
		textAlign: 'center',
	},
};

interface LoadingProps extends React.Props<Loading> {
	text?: string;
	speed?: number;
}

interface LoadingState {
	content: string;
}

/**
 * Renders a loading text element for use with API fetching
 *
 * @class      Loading
 */
export default class Loading extends React.Component<
	LoadingProps,
	LoadingState
> {
	static propTypes = {
		text: PropTypes.string.isRequired,
		speed: PropTypes.number.isRequired,
	};

	static defaultProps = {
		text: 'Loading',
		speed: 300,
	};

	interval: number;
	state: LoadingState = {
		content: this.props.text,
	};

	componentDidMount(): void {
		const { speed, text } = this.props;

		this.interval = window.setInterval((): void => {
			this.state.content === text + '...'
				? this.setState({ content: text })
				: this.setState(
						({ content }: LoadingState): LoadingState => ({
							content: content + '.',
						})
				  );
		}, speed);
	}

	componentWillUnmount(): void {
		window.clearInterval(this.interval);
	}

	render(): React.ReactNode {
		return <p style={styles.content}>{this.state.content}</p>;
	}
}
