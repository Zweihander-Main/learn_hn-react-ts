import * as PropTypes from 'prop-types';

export const HNItem = PropTypes.exact({
	id: PropTypes.number.isRequired,
	deleted: PropTypes.bool,
	type: PropTypes.string,
	by: PropTypes.string,
	time: PropTypes.number,
	text: PropTypes.string,
	dead: PropTypes.bool,
	parent: PropTypes.number,
	poll: PropTypes.number,
	kids: PropTypes.arrayOf(PropTypes.number),
	url: PropTypes.string,
	score: PropTypes.number,
	title: PropTypes.string,
	parts: PropTypes.arrayOf(PropTypes.number),
	descendants: PropTypes.number,
});

export const HNUser = PropTypes.shape({
	id: PropTypes.string.isRequired,
	created: PropTypes.number.isRequired,
	karma: PropTypes.number.isRequired,
	delay: PropTypes.number,
	about: PropTypes.string,
	submitted: PropTypes.arrayOf(PropTypes.number),
});

export const HNTypes = PropTypes.oneOf([
	'top',
	'new',
	'best',
	'ask',
	'show',
	'job',
]);

export const AppState = PropTypes.shape({
	theme: PropTypes.oneOf(['light', 'dark']).isRequired,
	toggleTheme: PropTypes.func.isRequired,
});
