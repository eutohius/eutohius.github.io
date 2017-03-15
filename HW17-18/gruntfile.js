module.exports = function(grunt) {

	//Project configuration
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint: {
			files: ['gruntfile.js', 'src/js/navbar-jq.js', 'src/js/script.js'],
			options: {
				globals: {
					jQuery: true,
					console: true,
					module: true
				}
			}
		},
		watch: {
			files: ['<%= jshint.files %>'],
			tasks: ['jshint']
		},
		concat: {
			options: {
				separator: ';'
			},
			js: {
				src: ['src/js/*.js', '!src/js/main.js', '!src/js/plugins.js'],
				dest: 'src/js/main.js'
			},
			plugins: {
				src: ['src/js/plugins/*.js'],
				dest: 'src/js/plugins.js'
			}
		},
		uglify: {
			options: {
				banner: '/* <% pkg.name %> <% grunt.template.today("dd-mm-yyyy") %> */\n'
			},
			dist: {
				files: {
					'dist/main.min.js': ['src/js/main.js'],
					'dist/plugins.min.js': ['src/js/plugins.js']
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
};