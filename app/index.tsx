import * as React from 'react';
import * as ReactDOM from 'react-dom';
import './index.css';
import { ThemeProvider } from './contexts/theme';
// import Nav from './components/Nav';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
// import Loading from './components/Loading';

class App extends React.Component<{}, Readonly<AppState>> {
	state = {
		theme: 'light',
		toggleTheme: (): void => {
			this.setState(({ theme }: AppState) => ({
				theme: theme === 'light' ? 'dark' : 'light',
			}));
		},
	} as AppState;

	render(): JSX.Element {
		return (
			<Router>
				<ThemeProvider value={this.state}>
					<div className={this.state.theme}>
						<div className="container">
							<Nav />
							<React.Suspense fallback={<Loading />}>
								<Switch>
									<Route
										render={(): JSX.Element => <h1>404</h1>}
									/>
								</Switch>
							</React.Suspense>
						</div>
					</div>
				</ThemeProvider>
			</Router>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('app'));
