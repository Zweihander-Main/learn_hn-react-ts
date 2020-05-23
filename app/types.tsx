import * as PropTypes from 'prop-types';

export interface HNItem {
	id: number;
	deleted?: boolean;
	type?: string;
	by?: string;
	time?: number;
	text?: string;
	dead?: boolean;
	parent?: number;
	poll?: number;
	kids?: Array<number>;
	url?: string;
	score?: number;
	title?: string;
	parts?: Array<number>;
	descendants?: number;
}

export interface HNUser {
	id: string;
	created: number;
	karma: number;
	delay?: number;
	about?: string;
	submitted?: Array<number>;
}

export type HNTypes = 'top' | 'new' | 'best' | 'ask' | 'show' | 'job';

export interface AppState {
	theme: 'light' | 'dark';
	toggleTheme: () => void;
}

export const HNItemPT = PropTypes.exact({
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

export const HNUserPT = PropTypes.shape({
	id: PropTypes.string.isRequired,
	created: PropTypes.number.isRequired,
	karma: PropTypes.number.isRequired,
	delay: PropTypes.number,
	about: PropTypes.string,
	submitted: PropTypes.arrayOf(PropTypes.number),
});

export const HNTypesPT = PropTypes.oneOf([
	'top',
	'new',
	'best',
	'ask',
	'show',
	'job',
]);

export const AppStatePT = PropTypes.shape({
	theme: PropTypes.oneOf(['light', 'dark']).isRequired,
	toggleTheme: PropTypes.func.isRequired,
});
