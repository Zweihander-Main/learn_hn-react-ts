import * as React from 'react';
import { AppState } from '../types';

const ThemeContext = React.createContext<AppState>({
	theme: 'light',
	toggleTheme: () => {
		null;
	},
});

export default ThemeContext;

export const {
	Consumer: ThemeConsumer,
	Provider: ThemeProvider,
} = ThemeContext;
