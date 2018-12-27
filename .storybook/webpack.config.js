const autoprefixer = require.main.require('autoprefixer');
const autoPrefixerPlugin = autoprefixer({ browsers: ['last 2 versions'] });

module.exports = storybookBaseConfig => {
	storybookBaseConfig.module.rules.push(
		{
			test: /\.woff(2)?(\?[a-z0-9=&.]+)?$/,
			loader: 'url-loader',
			options: {
				limit: 50000,
				mimetype: 'application/font-woff',
				name: './fonts/[name].[ext]',
			},
		},
		{
			test: /bootstrap.scss$/,
			use: [
				'style-loader',
				'css-loader',
				{
					loader: 'postcss-loader',
					options: {
						plugins: [autoPrefixerPlugin],
					},
				},
				{
					loader: 'sass-loader',
				},
			],
		},
		{
			test: /\.scss$/,
			exclude: /bootstrap.scss/,
			use: [
				'style-loader',
				'css-loader?sourceMap&modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
				{
					loader: 'postcss-loader',
					options: {
						plugins: [autoPrefixerPlugin],
					},
				},
				{
					loader: 'sass-loader',
				},
			],
		},
		{
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader',
				{
					loader: 'postcss-loader',
					options: {
						plugins: [autoPrefixerPlugin],
					},
				},
			],
		},
	);

	return storybookBaseConfig;
};
