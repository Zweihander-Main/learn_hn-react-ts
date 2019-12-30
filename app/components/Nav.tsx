import * as React from 'react';
import { ThemeConsumer } from '../contexts/theme';
import { NavLink } from 'react-router-dom';

const activeStyle = {
	color: 'rgb(187,46,31)',
};

export default function Nav(): JSX.Element {
	return (
		<ThemeConsumer>
			{({ theme, toggleTheme }: AppState): JSX.Element => (
				<nav className="row space-between">
					<ul className="row nav">
						<li>
							<NavLink
								activeStyle={activeStyle}
								exact
								to="/"
								className="nav-link"
							>
								Top
							</NavLink>
						</li>
						<li>
							<NavLink
								activeStyle={activeStyle}
								to="/new"
								className="nav-link"
							>
								New
							</NavLink>
						</li>
					</ul>
					<button
						style={{ fontSize: 30 }}
						className="btn-clear"
						onClick={toggleTheme}
					>
						{theme === 'light' ? '🔦' : '💡'}
					</button>
				</nav>
			)}
		</ThemeConsumer>
	);
}
