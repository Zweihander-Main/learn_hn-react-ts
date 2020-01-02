import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ThemeProvider } from './contexts/theme';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import Nav from './components/Nav';
import Loading from './components/Loading';

const ItemsPage = React.lazy(() => import('./components/ItemsPage'));
const PostPage = React.lazy(() => import('./components/PostPage'));
const UserPage = React.lazy(() => import('./components/UserPage'));

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
									<Route exact path="/">
										<ItemsPage type="top" />
									</Route>
									<Route path="/new">
										<ItemsPage type="new" />
									</Route>
									<Route path="/best">
										<ItemsPage type="best" />
									</Route>
									<Route path="/ask">
										<ItemsPage type="ask" />
									</Route>
									<Route path="/show">
										<ItemsPage type="show" />
									</Route>
									<Route path="/job">
										<ItemsPage type="job" />
									</Route>
									<Route path="/post" component={PostPage} />
									<Route path="/user" component={UserPage} />
									<Route>
										<h1>404</h1>
									</Route>
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
