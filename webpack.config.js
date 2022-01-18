const path = require('path'); // path ya esta disponible en node y no hay que instalar nada
const HtmlWebpackPlugin = require('html-webpack-plugin'); // plugin para generar un html (paso 16)
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // plugin para extraer el css a un archivo aparte (paso 20)
const CopyPlugin = require('copy-webpack-plugin'); // plugin para copiar archivos (paso 27)
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin'); // plugin para minimizar el css (paso 28)
const TerserPlugin = require('terser-webpack-plugin'); // plugin para minimizar el js (paso 29)
const Dotenv = require('dotenv-webpack'); // plugin para leer variables de entorno (paso 30)
const { CleanWebpackPlugin } = require('clean-webpack-plugin'); // plugin para limpiar el directorio dist (paso 31)

module.exports = {  
    entry: './src/index.js',    // entry point para la aplicacion
    output: {
        path: path.resolve(__dirname, 'dist'), // path donde se va a guardar el bundle
        filename: '[name].[contenthash].js', // nombre del archivo bundle
        assetModuleFilename: 'assets/images/[hash][ext][query]' // nombre de los archivos de imagenes (agregado con fonts)
    },
    resolve: {
        extensions: ['.js'], // extensiones que se van a buscar
        alias:{
            '@utils': path.resolve(__dirname, 'src/utils/'), // alias para usar @ en vez de src/
            '@templates': path.resolve(__dirname, 'src/templates/'),
            '@styles': path.resolve(__dirname, 'src/styles/'),
            '@images': path.resolve(__dirname, 'src/assets/images/'),
        }
    },
    module: {
        rules:[
            {
                test: /\.m?js$/, // le dice que utilice archivos con extension .js o .mjs
                exclude: /node_modules/, // excluye los archivos que esten en node_modules o bower_components
                use:{
                    loader: 'babel-loader', // utiliza el loader de babel
                }
            },
            {
                test: /\.css|.styl$/i, //sin espacios, i para que no se distinga entre mayusculas y minusculas
                use: [MiniCssExtractPlugin.loader, 
                    'css-loader',
                    'stylus-loader'
                ], // utiliza el loader de css
            },
            {
                test: /\.png/, // le dice que utilice archivos con extension .png,
                type: 'asset/resource', // le dice que es un recurso
            },
            {
                test: /\.(woff|woff2)$/, // le dice que utilice archivos con extension .woff o .woff2
                use:{
                    loader: 'url-loader', // utiliza el loader de url
                    options: {
                        limit: 10000, // le dice que solo se cargue si el archivo pesa menos de 100kb
                        mimetype: "application/font-woff", // le dice que el mimetype es application/font-woff
                        name: "[name].[contenthash].[ext]", // le dice que se guarde en fonts/[name].[ext]
                        outputPath: "./assets/fonts/", // le dice que se guarde en assets/
                        publicPath: "../assets/fonts/", // le dice que se guarde en assets/
                        esModule: false, // le dice que no sea un modulo
                    },
                }
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true, // injecta el bundle en el html
            template: './public/index.html', // template que se va a utilizar para generar el html
            filename: './index.html' // nombre del archivo html
        }),
        new MiniCssExtractPlugin({
            filename: 'assets/[name].[contenthash].css' // nombre del archivo css
        }), // plugin para extraer el css a un archivo aparte (paso 20)
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, "src", "assets/images"), // path donde se encuentran las imagenes en ""
                    to: "assets/images" // path donde se van a guardar las imagenes
                }
            ]
        }),
        new Dotenv(), // plugin para leer variables de entorno (paso 30)
        new CleanWebpackPlugin(), // plugin para limpiar el directorio dist (paso 31)
    ],
    optimization: {
        minimize: true, // le dice que se va a minimizar el bundle
        minimizer:[
            new CssMinimizerPlugin(), // plugin para minimizar el css 
            new TerserPlugin() // plugin para minimizar el js 
        ] 
    }
}