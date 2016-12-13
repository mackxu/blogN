// supervisor --harmony index.js
module.exports = {
	port: 3000,
	session: {
		secret: 'blogN',
		key: 'blogN',
		maxAge: 2550000
	},
	mongodb: 'mongodb://10.77.42.131:27017/myblog'
	// mongodb: 'mongodb://blog:blog@ds159767.mlab.com:59767/blogs'
};