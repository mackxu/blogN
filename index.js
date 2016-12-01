let path = require('path');
let express = require('express');
let session = require('express-session');
let MongoStore = require('connect-mongo')(session);
let flash = require('connect-flash')
let config = require('config-lite')
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
	store: new MongoStore({ url: config.mongodb })		// 将session存储到mongodb
}))
// flash 显示通知
app.use(flash())
// 路由
routes(app)
// 监听端口 启动程序
app.listen(config.port, function () {
	console.log(`${pkg.name} listening on port ${config.port}`);
});