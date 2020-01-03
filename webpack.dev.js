const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge.smart(common, {
	mode: 'development',
	// Enable sourcemaps for debugging webpack's output.
	devtool: 'source-map',
	devServer: {
		contentBase: './dist',
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
					'style-loader',
					{ loader: 'css-loader', options: { importLoaders: 1 } },
					{
						loader: 'postcss-loader',
						options: {
							sourceMap: true,
							plugins: [
								require('postcss-import')(),
								require('postcss-preset-env')(),
							],
						},
					},
				],
			},
		],
	},
});
