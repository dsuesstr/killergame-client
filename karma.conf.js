// Karma configuration
// Generated on Fri Dec 18 2015 19:14:20 GMT+0100 (CET)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      'bower_components/linqjs/linq.js',
      'bower_components/jquery/dist/jquery.js',
      'bower_components/ionic/release/js/ionic.bundle.js',
      'bower_components/moment/moment.js',
      'bower_components/toastr/toastr.js',
      'app/constants.js',
      'app/injections.js',
      'app/app.js',
    'app/routes.js',
    'app/controllers/MenuController.js',
    'app/controllers/LobbyController.js',
    'app/controllers/RankingController.js',
    'app/controllers/SettingsController.js',
    'app/controllers/AccountController.js',
    'app/controllers/GameController.js',
    'app/controllers/PlayerController.js',
    'app/controllers/InfoController.js',
    'app/filters/FormatFilter.js',
    'app/interfaces/Plugins.js',
    'app/interfaces/Services.js',
    'app/services/Urls.js',
    'app/run-services/InternetConnectionWatcher.js',
    'app/services/LocalStorage.js',
    'app/services/AccountHandler.js',
    'app/services/PlayerProvider.js',
    'app/services/GameProvider.js',
    'app/services/GameHandler.js',
    'app/services/ApiSettingsHandler.js',
    'app/services/Logger.js',
    'app/services/Navigation.js',
    'app/services/OpenLink.js',
    'app/services/Strings.js',
    'app/run-services/ClearHistory.js',
    'app/run-services/IonicConfig.js',
    'app/interfaces/models/Models.js',
    'app/interfaces/models/messages/Messages.js',
    'app/directives/Ranking.js',
    'app/directives/Navbar.js',
    'app/directives/Externallink.js',
      "app/directives/links/External.js",
    "app/directives/links/Email.js",
    'app/models/Models.js',
      'app/registrations.js',
      'app/run-services/AngularInit.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'tests/**/*.js'
    ],


    // list of files to exclude
    exclude: [

    ],


      proxies:  {
        '/app/views/': '../app/views/',
        '/app/data/': '../app/data/'
      },

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultanous
    concurrency: Infinity
  })
}
