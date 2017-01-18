/**
 * Created by antonsidorenko on 18.01.17.
 */
function generatePage(pageObj) {
    var headerText = pageObj.div.papagraph,
        question0 = pageObj.form.fieldset0.legend,
        q0opt0 = pageObj.form.fieldset0.div0.label.input,
        q0opt1 = pageObj.form.fieldset0.div1.label.input,
        q0opt2 = pageObj.form.fieldset0.div2.label.input,
        question1 = pageObj.form.fieldset1.legend,
        q1opt0 = pageObj.form.fieldset1.div0.label.input,
        q1opt1 = pageObj.form.fieldset1.div1.label.input,
        q1opt2 = pageObj.form.fieldset1.div2.label.input,
        question2 = pageObj.form.fieldset2.legend,
        q2opt0 = pageObj.form.fieldset2.div0.label.input,
        q2opt1 = pageObj.form.fieldset2.div1.label.input,
        q2opt2 = pageObj.form.fieldset2.div2.label.input,
        submitButtonText = pageObj.form.div.input.value;

    function generateNodes() {

        function generateElemWithTextNode(tagName, text) {
            var elem = document.createElement(tagName);
            elem.appendChild(document.createTextNode(text));
            return elem;
        }

        function generateElemWithClass(tagName, className) {
            var elem = document.createElement(tagName);
            elem.setAttribute('class', className);
            return elem;
        }

        function generateElemWithClassAndText(tagName, className, text) {
            var elem = document.createElement(tagName);
            elem.setAttribute('class', className);
            elem.appendChild(document.createTextNode(text));
            return elem;
        }

        function generateCheckboxWithLabel(name, labelText) {
            var checkbox = document.createElement('input');
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('value', 'true');
            checkbox.setAttribute('name', name);
            var label = document.createElement('label');
            label.appendChild(document.createTextNode(labelText));
            label.insertBefore(checkbox, label.lastChild);
            return label;
        }

        function generateForm(action, className, method) {
            var form = document.createElement('form');
            form.setAttribute('action', action);
            form.setAttribute('className', className);
            form.setAttribute('method', method);
            return form;
        }

        function generateSubmitButton(value, className) {
            var submit = document.createElement('input');
            submit.setAttribute('type', 'submit');
            submit.setAttribute('name', 'go');
            submit.setAttribute('value', value);
            submit.setAttribute('class', className);
            return submit;
        }

        function generateAnswerOptions(questionNumber) {
            var answersArr = [],
                questionName = 'option' + questionNumber +'-';
            for (var i = 1; i < arguments.length; i++) {
                var div = generateElemWithClass('div', 'form-check');
                div.appendChild(generateCheckboxWithLabel(questionName + i, arguments[i]));
                answersArr[i-1] = div;
            }
            return answersArr;
        }

        function appendAllOptions(parentNode, options) {
            for (var i = 0; i < options.length; i++) {
                parentNode.appendChild(options[i]);
            }

            return parentNode;
        }

        var wrp = generateElemWithClass('div', 'wrapper offset-1'),
            header = generateElemWithClass('div', 'row justify-content-center'),
            headerPara = generateElemWithClassAndText('p', 'col-auto offset-1 h1', headerText),
            mainForm = generateForm('#', 'offset-1', 'POST'),
            firstFieldset = generateElemWithClass('fieldset', 'form-group'),
            firstLegend = generateElemWithTextNode('legend', question0),
            firstQuestionOptions = generateAnswerOptions('1', q0opt0, q0opt1, q0opt2),
            secondFieldset = generateElemWithClass('fieldset', 'form-group'),
            secondLegend = generateElemWithTextNode('legend', question1),
            secondQuestionOptions = generateAnswerOptions('2', q1opt0, q1opt1, q1opt2),
            thirdFieldset = generateElemWithClass('fieldset', 'form-group'),
            thirdLegend = generateElemWithTextNode('legend', question2),
            thirdQuestionOptions = generateAnswerOptions('3', q2opt0, q2opt1, q2opt2),
            submitDiv = generateElemWithClass('div', 'row justify-content-center'),
            submitButton = generateSubmitButton(submitButtonText, 'btn btn-info btn-lg');

        header.appendChild(headerPara);
        firstFieldset.appendChild(firstLegend);
        secondFieldset.appendChild(secondLegend);
        thirdFieldset.appendChild(thirdLegend);
        appendAllOptions(firstFieldset, firstQuestionOptions);
        appendAllOptions(secondFieldset, secondQuestionOptions);
        appendAllOptions(thirdFieldset, thirdQuestionOptions);
        submitDiv.appendChild(submitButton);
        mainForm.appendChild(firstFieldset);
        mainForm.appendChild(secondFieldset);
        mainForm.appendChild(thirdFieldset);
        mainForm.appendChild(submitDiv);
        wrp.appendChild(header);
        wrp.appendChild(mainForm);

        return wrp;
    }

    return generateNodes();
}

var doc = document.body;
doc.appendChild(generatePage(page));