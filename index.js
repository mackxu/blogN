let path = require('path');
let express = require('express');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let flash = require('connect-flash')
let config = require('config-lite')
let winston = require('winston')
let expressWinston = require('express-winston')
let morgan = require('morgan')
let routes = require('./routes')
let pkg = require('./package')

let app = express();

// 设置存放模板文件目录
app.set('views', path.join(__dirname, 'views'));
// 设置模板引擎
app.set('view engine', 'ejs');

// 设置静态文件目录
app.use(express.static(path.join(__dirname, 'public')))
// session 中间件
app.use(session({
	name: config.session.key,
	secret: config.session.secret,
	resave: false,
	saveUninitialized: true,
	cookie: {
		maxAge: config.session.maxAge
	},
	// store: new MongoStore({ url: config.mongodb })		// 将session存储到mongodb
}))
// flash 显示通知
app.use(flash())

// body-parse
app.use(require('express-formidable')({
	uploadDir: path.join(__dirname, 'public/images'),
	keepExtensions: true
}));

// 设置模板全局常量
app.locals.blog = {
	title: pkg.name,
	description: pkg.description
}

// 添加模板必须的三个变量
app.use(function(req, res, next){
	res.locals.user = req.session.user;
	res.locals.success = req.flash('success').toString();
	res.locals.error = req.flash('error').toString();
	next();
})
// 正常请求的日志
// app.use(expressWinston.logger({
// 	transports: [
// 		new winston.transports.Console({
// 			json: true,
// 			colorize: true
// 		})
// 	]
// }))

app.use(morgan('short'))

// 路由
routes(app)

// 错误请求的日志
app.use(expressWinston.errorLogger({
	transports: [
		new winston.transports.Console({
			json: true,
			colorize: true
		})
	]
}))
// Error Page
app.use(function (err, req, res, next) {
	res.render('error', { error: err })
})

// 监听端口 启动程序
app.listen(config.port, function () {
	console.log(`${pkg.name} listening on port ${config.port}`);
})