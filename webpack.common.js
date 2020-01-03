const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: './app/index.tsx',
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'index_bundle.js',
		chunkFilename: '[name].chunk.js',
		publicPath: '/',
	},

	resolve: {
		// Add '.ts' and '.tsx' as resolvable extensions.
		extensions: ['.js', '.jsx', '.ts', '.tsx'],
	},

	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
					},
				],
			},
			{
				test: /\.(js|jsx)$/,
				use: 'babel-loader',
			},
			// All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
			{
				enforce: 'pre',
				test: /\.js$/,
				loader: 'source-map-loader',
			},
		],
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CopyPlugin([{ from: '_redirects' }]),
		new HtmlWebpackPlugin({
			template: 'app/index.html',
		}),
	],
	devServer: {
		historyApiFallback: true,
	},
};
