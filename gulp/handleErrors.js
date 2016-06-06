var notify = require('gulp-notify');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');

module.exports = function(error){
    var args = Array.prototype.slice.call( arguments );
    if ( typeof(error) === "undefined" ){
        gutil.log("great! No error!!");
    }

    else {
        gutil.log('Error!!! Attention!!!!!', error);
        notify.onError({
            title: ' compile error ',
            message: '<%= error.message %>'
        }).apply(this, args); //替换为当前对象
        this.emit("end"); //提交
    }
}
