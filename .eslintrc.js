module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module',
	},
	env: {
		browser: true,
	},
	plugins: ['html', 'prettier'],
	extends: ['airbnb', 'prettier'],
	rules: {
		'prettier/prettier': ['error'],
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
		indent: [2, 'tab'],
		'no-tabs': 0,
		eqeqeq: ['error', 'always', { null: ignore }],
	},
};
