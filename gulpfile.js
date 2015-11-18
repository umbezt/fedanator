var elixir = require('laravel-elixir');

config.publicPath = 'src';
config.assetsPath = 'assets'

elixir(function(mix) {
  // watch the sass files and compile them
  mix.sass('app.scss');

  // copy bootstrap files to where they can be managed
  mix.copy('bower_components/jquery/dist/jquery.min.js', 'assets/js/jquery.min.js');
  mix.copy('bower_components/bootstrap/dist/js/bootstrap.min.js', 'assets/js/bootstrap.min.js');
  mix.copy('bower_components/bootstrap/dist/css/bootstrap.min.css', 'src/css/bootstrap.min.css');
  mix.scripts([
    'jquery.min.js',
    'bootstrap.min.js',
    'app.js'
  ]);
});
