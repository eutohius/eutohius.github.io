/**
 * Created by antonsidorenko on 30.01.17.
 */


var timer = new Timer();
var timerRun;

var buttonGroup = document.querySelector('.btn-group'),
    startButton = document.querySelector('.start'),
    pauseButton = createPauseButton(),
    resetButton = document.querySelector('.reset'),
    stopButton = document.querySelector('.stop'),
    splitButton = document.querySelector('.split'),
    displayedHours = document.querySelector('.hours'),
    displayedMinutes = document.querySelector('.minutes'),
    displayedSeconds = document.querySelector('.seconds'),
    displayedMillis = document.querySelector('.millis'),
    resultsContainer = document.querySelector('.results'),
    splitResultsTable = createSplitTable(),
    splitBadge = createBadge('split', 'badge-primary'),
    stopTable = document.querySelector('.stopTable');

startButton.addEventListener('click', launchTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);
stopButton.addEventListener('click', stopTimer);
splitButton.addEventListener('click', splitResult);

function createPauseButton() {
    var button = document.createElement('button');
    button.type = button;
    button.className = 'btn btn-secondary pause'
    button.innerHTML = 'pause';
    return button;

}

function createSplitTable() {
    var tab = document.createElement('table');
    tab.classList.add('table');
    var tabBody = document.createElement('tbody');
    tab.appendChild(tabBody);
    return tab;
}

function createBadge(text, type) {
    var badge = document.createElement('span');
    badge.classList.add('badge');
    badge.classList.add(type);
    badge.innerHTML = text;
    return badge;
}

function launchTimer() {
    buttonGroup.replaceChild(pauseButton, startButton);
    timer.start();
    timerRun = setInterval(function () {
        displayedHours.innerHTML = timer.getHours() < 10 ? '0' + timer.getHours() : timer.getHours();
        displayedMinutes.innerHTML = timer.getMinutes() < 10 ? '0' + timer.getMinutes() :  timer.getMinutes();
        displayedSeconds.innerHTML = timer.getSeconds() < 10 ? '0' + timer.getSeconds() : timer.getSeconds();
        displayedMillis.innerHTML = timer.getMillis() < 10 ? '00' + timer.getMillis() :
            timer.getMillis() < 100 ? '0' + timer.getMillis() : timer.getMillis();
    }, 4);
    stopTable.style.visibility = 'hidden';
}

function pauseTimer() {
    timer.pause();
    clearInterval(timerRun);
    buttonGroup.replaceChild(startButton, pauseButton);
}

function resetTimer() {
    clearInterval(timerRun);
    if (!timer.isPaused() && !timer.isStopped()) buttonGroup.replaceChild(startButton, pauseButton)
    timer.reset();
    displayedHours.innerHTML = '00';
    displayedMinutes.innerHTML = '00';
    displayedSeconds.innerHTML = '00';
    displayedMillis.innerHTML = '000';
    try
    {resultsContainer.removeChild(splitResultsTable);}
    catch (e) {
        console.log('There is no split data to reset');
    }
    splitResultsTable = createSplitTable();
    stopTable.style.visibility = 'hidden';

}

function stopTimer() {
    if (timer.isStopped()) return;
    buttonGroup.replaceChild(startButton, pauseButton);
    var stopTimerObj = timer.stop();
    var hours = stopTimerObj.hours < 10 ? ('0' + stopTimerObj.hours) : ('' + stopTimerObj.hours),
        minutes = stopTimerObj.minutes < 10 ? ('0' + stopTimerObj.minutes) : ('' + stopTimerObj.minutes),
        seconds = stopTimerObj.seconds < 10 ? ('0' + stopTimerObj.seconds) : ('' + stopTimerObj.seconds),
        ms = stopTimerObj.millis < 10 ? '00' + stopTimerObj.millis :
            stopTimerObj.millis < 100 ? '0' + stopTimerObj.millis : '' + stopTimerObj.millis;
    displayedHours.innerHTML = '00';
    displayedMinutes.innerHTML = '00';
    displayedSeconds.innerHTML = '00';
    displayedMillis.innerHTML = '000';
    document.getElementById('stoptime').innerHTML = hours + ':' + minutes + ':' + seconds + ':' + ms;
    stopTable.style.visibility = 'visible';

}

function splitResult() {
    if (timer.isStopped()) return;
    var splitTimeObj = timer.split();
    var hours = splitTimeObj.hours < 10 ? ('0' + splitTimeObj.hours) : ('' + splitTimeObj.hours),
        minutes = splitTimeObj.minutes < 10 ? ('0' + splitTimeObj.minutes) : ('' + splitTimeObj.minutes),
        seconds = splitTimeObj.seconds < 10 ? ('0' + splitTimeObj.seconds) : ('' + splitTimeObj.seconds),
        ms = splitTimeObj.millis < 10 ? '00' + splitTimeObj.millis :
            splitTimeObj.millis < 100 ? '0' + splitTimeObj.millis : '' + splitTimeObj.millis;
    var row = document.createElement('tr'),
        number = document.createElement('td'),
        data = document.createElement('td'),
        badge = document.createElement('td');
    number.innerHTML = '' + splitTimeObj.number;
    data.innerHTML = hours + ':' + minutes + ':' + seconds + ':' + ms + ';';
    badge.appendChild(splitBadge.cloneNode(true));
    row.appendChild(number);
    row.appendChild(data);
    row.appendChild(badge);
    splitResultsTable.tBodies[0].appendChild(row);
    resultsContainer.appendChild(splitResultsTable);
}
