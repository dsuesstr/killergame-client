var commentWrapper = require('./commentWrapper.js');

module.exports = {
// Create standard comments header for minified files
    createComments: function (gutil) {
        var comments = [
            '2BIT GmbH',
            'Copyright 2014',
            'Not for free use',
            'Compiled on ' + gutil.date('mmm d, yyyy h:MM:ss TT Z')
        ];
        return commentWrapper.wrap(comments);
    }
};
