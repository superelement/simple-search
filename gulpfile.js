var gulp = require('gulp')
  , watch = require('gulp-watch')
  , jasmine = require('gulp-jasmine')
  , flatten = require("gulp-flatten")
  , sass = require("gulp-sass")
  , autoprefixer = require("gulp-autoprefixer")
//   , plumber = require('gulp-plumber')
  , ts = require("gulp-typescript")
  , tsProject = ts.createProject("tsconfig.json")
  , runSequence = require('run-sequence').use(gulp)


var autoPrefixerBrowsers = [
    // Desktop
      'last 3 Chrome versions'
    , 'last 2 Firefox versions'
    , 'last 2 Safari versions'
    , 'last 2 Edge versions'
    , 'ie >= 9'
    // Mobile
    , 'last 3 ChromeAndroid versions'
    , 'last 3 Android versions'
    , 'last 3 FirefoxAndroid versions'
    , 'last 3 iOS versions'
    , 'last 2 ExplorerMobile versions'
    , 'last 2 OperaMobile versions'
    // Other
    , '> 2% in AU'
]

gulp.task('test', function() {
	return gulp.src('src/specs.js')
		.pipe(jasmine())
})

gulp.task('default', ['ts', 'test', 'css'])

gulp.task("ts", function() {
	return tsProject.src()
	    .pipe(ts(tsProject))
		// .pipe(plumber())
	    // .js
        .pipe(flatten())
	    .pipe(gulp.dest("dist"))
})

gulp.task("tsw", function() {
	runSequence('default');
	return watch('./src/**/*.ts', function() {
		runSequence('default');
	})
})


gulp.task('css', function () {
	return gulp.src("src/scss/**/*.scss")
		.pipe(sass({ style: 'compressed' }))
			.on('error', function (err) {
					console.log('Sass error', err);
			})
		.pipe(flatten())
		.pipe(autoprefixer({browsers: autoPrefixerBrowsers}))
		.pipe(gulp.dest("dist/"))// placed in "min"
});