import * as React from 'react';
import * as PropTypes from 'prop-types';

const styles: { content: React.CSSProperties } = {
	content: {
		fontSize: '35px',
		marginTop: '20px',
		textAlign: 'center',
	},
};

interface LoadingProps {
	text?: string;
	speed?: number;
}

/**
 * Renders a loading text element for use with API fetching
 */
const Loading: React.FC<LoadingProps> = ({
	text = 'Loading',
	speed = 300,
}: LoadingProps) => {
	const [content, setContent] = React.useState(text);

	React.useEffect(() => {
		const id = window.setInterval((): void => {
			setContent((content) => {
				return content === `${text}...` ? text : `${content}.`;
			});
		}, speed);

		return () => window.clearInterval(id);
	}, [text, speed]);

	return <p style={styles.content}>{content}</p>;
};

Loading.propTypes = {
	text: PropTypes.string,
	speed: PropTypes.number,
};

export default Loading;
