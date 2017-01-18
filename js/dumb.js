/**
 * Created by antonsidorenko on 17.01.17.
 */
var quizHtml = '<div class="row justify-content-center"><p class="col-auto offset-1 h1">' +
    page.div.papagraph +
    '</p></div><form action="#" class="offset-1"  method="POST"><fieldset class="form-group"><legend>' +
    page.form.fieldset0.legend +
    '</legend><div class="form-check"><label><input type="checkbox" name="option1-1" value="true">' +
        page.form.fieldset0.div0.label.input +
        '</label></div><div class="form-check"><label><input type="checkbox" name="option1-2" value="true">' +
        page.form.fieldset0.div1.label.input +
        '</label></div><div class="form-check"><label><input type="checkbox" name="option1-3" value="true">' +
        page.form.fieldset0.div2.label.input +
        '</label></div></fieldset><fieldset class="form-group"><legend>' +
        page.form.fieldset1.legend +
        '</legend><div class="form-check"><label><input type="checkbox" name="option2-1" value="true">' +
        page.form.fieldset1.div0.label.input +
        '</label></div><div class="form-check"><label><input type="checkbox" name="option2-2" value="true">' +
        page.form.fieldset1.div1.label.input +
        '</label></div><div class="form-check"><label><input type="checkbox" name="option2-3" value="true">' +
        page.form.fieldset1.div2.label.input +
        '</label></div></fieldset><fieldset class="form-group"><legend>' +
        page.form.fieldset2.legend +
        '</legend><div class="form-check"><label><input type="checkbox" name="option3-1" value="true">' +
        page.form.fieldset2.div0.label.input +
        '</label></div><div class="form-check"><label><input type="checkbox" name="option3-2" value="true">' +
        page.form.fieldset2.div1.label.input +
        '</label></div><div class="form-check"><label><input type="checkbox" name="option3-3" value="true">' +
        page.form.fieldset2.div2.label.input +
        '</label></div></fieldset><div class="row justify-content-center"><input type="submit" name="go" ' +
    'value="Проверить мои результаты" class="btn btn-info btn-lg"></div></form>';

var wrapper = document.createElement('div');
wrapper.className = 'wrapper';
wrapper.innerHTML = quizHtml;

document.body.appendChild(wrapper);