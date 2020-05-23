import * as React from 'react';
import { ThemeConsumer } from '../contexts/theme';
import { NavLink } from 'react-router-dom';

const activeStyle = {
	color: 'rgb(187,46,31)',
};

/**
 * Renders a navigation bar with links to different post type listing and a
 * theme switcher
 *
 * @class      Nav
 * @return     {React.ReactNode}
 */
const Nav: React.FC = () => {
	return (
		<ThemeConsumer>
			{({ theme, toggleTheme }: AppState): React.ReactNode => (
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
						<li>
							<NavLink
								activeStyle={activeStyle}
								to="/best"
								className="nav-link"
							>
								Best
							</NavLink>
						</li>
						<li>
							<NavLink
								activeStyle={activeStyle}
								to="/ask"
								className="nav-link"
							>
								Ask
							</NavLink>
						</li>
						<li>
							<NavLink
								activeStyle={activeStyle}
								to="/show"
								className="nav-link"
							>
								Show
							</NavLink>
						</li>
						<li>
							<NavLink
								activeStyle={activeStyle}
								to="/job"
								className="nav-link"
							>
								Job
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
};

export default Nav;
