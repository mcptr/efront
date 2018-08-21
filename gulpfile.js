var gulp = require("gulp");

//var browserSync = require("browser-sync").create();
var sass = require("gulp-sass");
var minifyCss = require("gulp-minify-css");
var minifyHtml = require("gulp-minify-html");
var jshint = require("gulp-jshint");
var jst = require("gulp-amd-jst");
var uglify = require("gulp-uglify");
var useref = require("gulp-useref");
var rev = require("gulp-rev");
var concat = require("gulp-concat");
var remove = require("gulp-remove-files");
var livereload = require("gulp-livereload");
var gulpsync = require("gulp-sync")(gulp);
var amdOptimize = require("gulp-amd-optimizer");
var gulpif = require("gulp-if");
var shell = require("gulp-shell");
var inject = require("gulp-inject");
var dot = require("gulp-dot");
var header = require("gulp-header");


var paths = {
	vendor: "src/js/vendor",
	sass: {
		input: "src/css/**/*.scss",
		output: {
			devel: "src/build/css",
			release: "dist/css"
		}
	},
	html: {
		input: "src/*.html"
	},
	js: {
		input: "src/js/**/*.js",
		output: "dist/js"
	},
	jst: {
		input: "src/templates/**/*.html",
		output: {
			devel: "src/js/templates"
		}
	}
};

// Compile sass into CSS
gulp.task("sass", ["clean"], function() {
    return gulp.src(paths.sass.input)
        .pipe(sass({
			includePaths: [paths.bower_components],
		}))
        .pipe(gulp.dest(paths.sass.output.devel))
		.pipe(minifyCss())
        .pipe(gulp.dest(paths.sass.output.release))
		.pipe(livereload());
});

// JS lint
gulp.task("jslint", function() {
    return gulp.src(paths.js.input)
        .pipe(jshint(".jshintrc"))
        .pipe(jshint.reporter("default"));
});

//process JS files and return the stream.
// gulp.task("js", function () {
//     return gulp.src(paths.js.input)
//         .pipe(uglify())
// 		.pipe("concat")
//         .pipe(gulp.dest(paths.js.output))
// 		.pipe(livereload());
// });

// require js
gulp.task("rjs", shell.task([
	"./node_modules/requirejs/bin/r.js -o require.build.js"
]));

gulp.task("jst", function() {
    return gulp.src(paths.jst.input)
        .pipe(jst({
            amd : true,
            namespace : false
		}))
		.pipe(gulp.dest(paths.jst.output.devel))
		.pipe(livereload());
});

gulp.task('dot', function() {
    gulp.src('src/dot/**/*.dot')
    .pipe(dot())
	//.pipe(header('haha.JST = {};'))
    .pipe(gulp.dest('dupa'));
});

gulp.task("useref", function() {
	var assets = useref.assets();
	return gulp.src(paths.html.input)
		.pipe(assets)
        .pipe(gulpif("*.js", uglify()))
        .pipe(gulpif("*.css", minifyCss()))
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest("dist"))
		.pipe(livereload());
});

gulp.task("clean", function() {
	return gulp.src(
		[
			paths.sass.output.release,
			paths.sass.output.devel,
		])
		.pipe(remove());
});

gulp.task("watch", ["build"], function() {
	livereload.listen();
	gulp.watch(paths.sass.input, ["sass"]);
	//gulp.watch(paths.js.input, ["rjs"]);
	gulp.watch(paths.jst.input, ["jst"]);
});

gulp.task("build", ["sass", "jslint", "jst"]);

// Static Server + watching scss/html files
gulp.task("serve", ["build", "watch"], function() {
	console.log("Watch active");
});

gulp.task("default", gulpsync.sync(["clean", "build", "useref"]));

