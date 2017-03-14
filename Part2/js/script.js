'use strict';
(function($, undefined) {
	$(function() {
		var numberOfTestsStored = localStorage.getItem('numberOfTestsStored') ?
									localStorage.getItem('numberOfTestsStored') : 0;
		console.log(numberOfTestsStored);
		function Test(header) {
	    this.header = header;
	    this.questions = [];
	}

	Test.prototype.addQuestion = function(text, options, correctAnswers) {
		this.questions.push({
			text: text,
			options: options,
			correctAnswers: correctAnswers
		});
	};

	Test.prototype.setHeader = function(header) {
		this.header = header;
	};

	function TestRadio(header) {
	}

	function TestCheckbox(header) {
	}

	TestRadio.prototype = Object.create(Test.prototype);
	TestCheckbox.prototype = Object.create(Test.prototype);

	var $appendOptionField = $('.addField'),
		$mainForm = $('.mainForm'),
		optionFieldsDisplayedNumber = 2;

	$appendOptionField.on('click', function(e) {
		e.preventDefault();
		if (optionFieldsDisplayedNumber >= 7) {
			console.log('Sorry, max number of options(7) reached');
			return;
		}
		$(this).before('<div class="optionWrapper"><input type="text" name="option' + 
			++optionFieldsDisplayedNumber +
			'" class="options"> <label><input type="checkbox" name="correct' + 
			optionFieldsDisplayedNumber + 
			'"> Correct option</label></div>');
	});

	$mainForm.on('submit', function(e) {
		e.preventDefault();
		var test = new Test('Custom test created ' + new Date());
		var question = $mainForm.find('input[name="question"]').val(),
			$options = $mainForm.find('.options'),
			options = [],
			correctAnswers = [];
		$options.each(function(index) {
			options.push($(this).val());
			if($(this).next().find('input[type="checkbox"]').prop('checked')) {
				correctAnswers.push(index);
			}
		});
		test.addQuestion(question, options, correctAnswers);
		console.log(test);
		var testJSON = JSON.stringify(test);
		localStorage.setItem('test' + numberOfTestsStored++, testJSON);
		localStorage.setItem('numberOfTestsStored', numberOfTestsStored);
	});

	$('.getRandomTest').on('click', getTestFromLocalStorage);

	function getTestFromLocalStorage (e) {
		e.preventDefault;
		var testFromLocStor = JSON.parse(localStorage.getItem('test' + getRandomTestNumber()));
		console.log(testFromLocStor.questions[0].text);
		for (var i = 0; i < testFromLocStor.questions[0].options.length; i++) {
			console.log(i+1 + '. ' + testFromLocStor.questions[0].options[i]);
		}

		var corrAnswString = '';

		for(var j = 0; j < testFromLocStor.questions[0].correctAnswers.length; j++) {
			corrAnswString += (j+1) + ' ';
		}

		console.log('Correct answers are:' + corrAnswString);
	}

	function getRandomTestNumber() {
		return Math.floor((parseInt(localStorage.getItem('numberOfTestsStored')) * Math.random()));
	}
});
})(jQuery);















