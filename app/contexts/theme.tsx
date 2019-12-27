import * as React from 'react';

const { Consumer, Provider } = React.createContext(null as AppState);

export const ThemeConsumer = Consumer;
export const ThemeProvider = Provider;
