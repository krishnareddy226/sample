	// create the module and name it scotchApp
	var speechApp = angular.module('speechApp', ['ngRoute']);

	// configure our routes
    speechApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
			})

			// route for the about page
			.when('/about', {
				templateUrl : 'pages/about.html',
				controller  : 'aboutController'
			})

			// route for the contact page
			.when('/contact', {
				templateUrl : 'pages/contact.html',
				controller  : 'contactController'
			});
	});

	// create the controller and inject Angular's $scope
    speechApp.controller('mainController', function($scope) {
		// create a message to display in our view
		$scope.message = 'Everyone come and see how good I look!';

        var final_transcript = '';
        var recognizing = false;

        if ('webkitSpeechRecognition' in window) {

            var recognition = new webkitSpeechRecognition();

            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = function() {
                recognizing = true;
            };

            recognition.onerror = function(event) {
                console.log(event.error);
            };

            recognition.onend = function() {
                recognizing = false;
            };

            recognition.onresult = function(event) {
                var interim_transcript = '';
                for (var i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        final_transcript += event.results[i][0].transcript;
                    } else {
                        interim_transcript += event.results[i][0].transcript;
                    }
                }
                final_transcript = capitalize(final_transcript);
                final_span.innerHTML = linebreak(final_transcript);
                interim_span.innerHTML = linebreak(interim_transcript);

            };
        }

        var two_line = /\n\n/g;
        var one_line = /\n/g;
        function linebreak(s) {
            return s.replace(two_line, '<p></p>').replace(one_line, '<br>');
        }

        function capitalize(s) {
            return s.replace(s.substr(0,1), function(m) { return m.toUpperCase(); });
        }

         $scope.startDictation=function(event) {
            if (recognizing) {
                recognition.stop();
                return;
            }
            final_transcript = '';
            recognition.lang = document.getElementById("lang").value ;
            recognition.start();
            final_span.innerHTML = '';
            interim_span.innerHTML = '';
        }


        $scope.emailButton=function() {
            if (recognizing) {
                create_email = true;
                recognizing = false;
                recognition.stop();
            } else {
                createEmail();
            }
            email_button.style.display = 'none';
            email_info.style.display = 'inline-block';
            showInfo('');
        }



        $scope.copyButton=function() {
            var el = document.getElementById("btnCopy");
            el.innerText = "Copied";
            setTimeout(function() {
                el.innerText = "Copy";
            }, 3000);
        }


        function createEmail() {
            var n = final_transcript.indexOf('\n');
            if (n < 0 || n >= 80) {
                n = 40 + final_transcript.substring(40).indexOf(' ');
            }
            var subject = encodeURI(final_transcript.substring(0, n));
            var body = encodeURI(final_transcript.substring(n + 1));
            window.location.href = 'mailto:?subject=' + subject + '&body=' + body;
        }

	});

    speechApp.controller('aboutController', function($scope) {
		$scope.message = 'Look! I am an about page.';
	});

    speechApp.controller('contactController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});