const $           = require('gulp-load-plugins')(),
      browserSync = require('browser-sync').create(),
      del         = require('del'),
      gulp        = require('gulp')

function data() {
	return gulp.src('source/data/**/*')
		.pipe(gulp.dest('build/assets/data'))
}

function files() {
  return gulp.src('source/files/**/*')
		.pipe(gulp.dest('build/assets/files'))
}

function fonts() {
  return gulp.src('source/fonts/**/*')
		.pipe(gulp.dest('build/assets/fonts'))
}

function images() {
	return gulp.src('source/images/**/*')
		.pipe($.imagemin([
			$.imagemin.gifsicle({interlaced: true}),
			$.imagemin.jpegtran({progressive: true}),
			$.imagemin.optipng({optimizationLevel: 5})
		]))
		.pipe(gulp.dest('build/assets/images'))
}

function movies() {
  return gulp.src('source/movies/**/*')
		.pipe(gulp.dest('build/assets/movies'))
}

function html() {
	return gulp.src('source/*.pug')
		.pipe($.pug())
		.pipe($.htmlmin({
			collapseBooleanAttributes: true,
			collapseWhitespace: true,
			minifyCSS: true,
			minifyJS: true,
			processConditionalComments: true,
			removeAttributeQuotes: true,
			removeComments: true,
			removeEmptyAttributes: true
		}))
		.pipe(gulp.dest('build'))
}

function css() {
  return gulp.src('source/stylesheets/**/*.scss')
		.pipe($.sourcemaps.init({ loadMaps: true }))
		.pipe($.sass({
			includePaths: require('node-normalize-scss').includePaths
		}).on('error', $.sass.logError))
		.pipe($.autoprefixer({browsers: ['last 2 versions']}))
		.pipe($.cssnano())
		.pipe($.sourcemaps.write('../maps'))
		.pipe(gulp.dest('build/assets/stylesheets'))
		.pipe(browserSync.stream())
}

function js() {
	return gulp.src('source/scripts/main.js')
		.pipe($.sourcemaps.init({ loadMaps: true }))
		.pipe($.concat('main.js'))
		.pipe($.jshint())
		.pipe($.jshint.reporter('default'))
		.pipe($.babel())
		.pipe($.uglify())
		.pipe($.sourcemaps.write('../maps'))
		.pipe(gulp.dest('build/assets/scripts'))
}

function clean() {
	return del('build/*');
}

function watch_files() {
	gulp.watch('source/data/**/*', data)
	gulp.watch('source/images/**/*', files)
	gulp.watch('source/fonts/**/*', fonts)
	gulp.watch('source/images/**/*', images)
	gulp.watch('source/movies/**/*', movies)

	gulp.watch('source/*.pug', html).on('change', browserSync.reload)
	gulp.watch('source/stylesheets/**/*.scss', css)
	gulp.watch('source/scripts/**/*.js', js).on('change', browserSync.reload)

	browserSync.init({
		server: {
			baseDir: 'build'
		}
	});
}

exports.build = gulp.series(
	clean,
	data,
	files,
	fonts,
	images,
	movies,
	html,
	css,
	js
)

exports.watch   = watch_files
exports.clean   = clean
exports.default = watch_files