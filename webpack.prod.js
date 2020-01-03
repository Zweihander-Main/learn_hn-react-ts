const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge.smart(common, {
	mode: 'production',
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
							sourceMap: false,
							plugins: [
								require('postcss-import')(),
								require('postcss-preset-env')(),
								require('cssnano')(),
							],
						},
					},
				],
			},
		],
	},
});
