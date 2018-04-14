const Path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (options) => {
  const ExtractSASS = new ExtractTextPlugin(`/styles/${options.cssFileName}`);

  const webpackConfig = {
    devtool: options.devtool,
    entry: [
      `webpack-dev-server/client?http://localhost:${+ options.port}`,
      'webpack/hot/dev-server',
      Path.join(__dirname, '../src/index.js'),
    ],
    output: {
      path: Path.join(__dirname, '../dist'),
      filename: `/scripts/${options.jsFileName}`
    },
    resolve: {
      extensions: ['', '.js', '.jsx'],
    },
    module: {
      loaders: [{
        test: /.jsx?$/,
        include: Path.join(__dirname, '../src'),
        loader: 'babel-loader',
      }, {
        //   test: /\.css$/,
        //   loaders: [
        //     'style?sourceMap',
        //     'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
        //   ]
        // }, {
        test: /\.css$/,
        // exclude: Path.join(__dirname, '../src'),
        loader: 'style!css',
      }, {
        //   test: /\.less$/,
        //   loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!less-loader'),
        // }, {
        test: /\.json$/,
        loader: "json-loader"
      }, {
        test: /\.sass/,
        loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded&indentedSyntax'
      }, {
        test: /\.(woff2)|(woff)|(svg)|(eot)|(ttf)|(otf)$/,
        loader: 'url-loader?name=fonts/[name].[md5:hash:hex:7].[ext]'
      }],
    },
    plugins: [
      new Webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(options.isProduction ? 'production' : 'development'),
        },
      }),
      new HtmlWebpackPlugin({
        template: Path.join(__dirname, '../src/index.html'),
      }),
    ],
  };

  if (options.isProduction) {
    webpackConfig.entry = [Path.join(__dirname, '../src/index')];

    webpackConfig.output.publicPath = '.';

    webpackConfig.plugins.push(
      new Webpack.optimize.OccurenceOrderPlugin(),
      new Webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false,
        },
      }),
      ExtractSASS
    );

    webpackConfig.module.loaders.push({
      test: /\.scss$/,
      loader: ExtractSASS.extract(['css', 'sass']),
    });
  } else {
    webpackConfig.plugins.push(
      new Webpack.HotModuleReplacementPlugin()
    );

    webpackConfig.module.loaders.push({
      test: /\.scss$/,
      loaders: ['style', 'css', 'sass'],
    });
    webpackConfig.devServer = {
      hot: true,
      port: options.port,
      inline: true,
      historyApiFallback: true,
      stats: 'errors-only',
    };
  }
  return webpackConfig;
};
