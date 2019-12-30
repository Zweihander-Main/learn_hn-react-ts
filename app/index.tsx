import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ThemeProvider } from './contexts/theme';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import Nav from './components/Nav';
import Loading from './components/Loading';
import Top from './components/Top';
import New from './components/New';
import Post from './components/Post';
import User from './components/User';

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
									<Route exact path="/" component={Top} />
									<Route exact path="/new" component={New} />
									<Route path="/post" component={Post} />
									<Route path="/user" component={User} />
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
