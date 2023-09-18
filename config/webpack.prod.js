import fs from 'fs';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import FileIncludeWebpackPlugin from 'file-include-webpack-plugin-replace';
import CopyPlugin from "copy-webpack-plugin";
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from "terser-webpack-plugin";

import * as path from 'path';

const srcFolder = "src";
const builFolder = "dist";
const rootFolder = path.basename(path.resolve());

let htmlPages = [];

htmlPages = [new FileIncludeWebpackPlugin({
	source: srcFolder,
	destination: '../',
	htmlBeautifyOptions: {
		"indent-with-tabs": true,
		'indent_size': 3
	},
	replace: [
		{ regex: '../img', to: 'img' },
		{ regex: '@img', to: 'img', },
		{ regex: 'NEW_PROJECT_NAME', to: rootFolder }
	],
})]

const paths = {
	src: path.resolve(srcFolder),
	build: path.resolve(builFolder)
}
const config = {
	mode: "production",
	cache: {
		type: 'filesystem'
	},
	optimization: {
		minimizer: [new TerserPlugin({
			extractComments: false,
		})],
	},
	output: {
		path: `${paths.build}`,
		filename: 'app.min.js',
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
			{
				test: /\.(scss|css)$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'string-replace-loader',
						options: {
							search: '@img',
							replace: '../img',
							flags: 'g'
						}
					}, {
						loader: 'css-loader',
						options: {
							importLoaders: 0,
							sourceMap: false,
							modules: false,
							url: {
								filter: (url, resourcePath) => {
									if (url.includes("img") || url.includes("fonts")) {
										return false;
									}
									return true;
								},
							},
						},
					},
					{
						loader: 'sass-loader',
						options: {
							sassOptions: {
								outputStyle: "expanded",
							},
						}
					},
				],
			}
		],
	},
	plugins: [
		...htmlPages,
		new MiniCssExtractPlugin({
			filename: '../css/style.css',
		}),
		new CopyPlugin({
			patterns: [
				{
					from: `${paths.src}/files`, to: `../files`,
					noErrorOnMissing: true
				}, {
					from: `${paths.src}/favicon.ico`, to: `../`,
					noErrorOnMissing: true
				}
			],
		})
	],
	resolve: {
		extensions: ["", ".webpack.js", ".web.js", '.tsx', '.ts', '.js'],
		alias: {
			"@scss": `${paths.src}/scss`,
			"@js": `${paths.src}/js`,
			"@img": `${paths.src}/img`
		},
	},
}
export default config;