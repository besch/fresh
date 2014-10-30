var gulp = require('gulp'),
		connect = require('gulp-connect');

gulp.task('connectDev', function() {
	connect.server({
		// server: 'backend/server',
		// root: 'app',
		// host: 'localhost',
		port: 3000,
		livereload: true//,
		livereload: {
			port: 35729
		}
	});
});

gulp.task('default', ['connectDev'], function() {

});