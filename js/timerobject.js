/**
 * Created by antonsidorenko on 31.01.17.
 */
/* Функции и свойства таймера реализованы в объекте Timer. Графическое представление реализовано отдельно в файле css/timerscipt.js */
function Timer() {
    var stopped = true,
        paused = false,
        hours = 0,
        minutes = 0,
        seconds = 0,
        millis = 0,
        zeroTime = Date.now(),
        previousTime = 0,
        currentTime = 0,
        stopTime = 0,
        splitTime = 0,
        splitNumber = 0,
        run = null,
        self = this;

    this.nextStep = function() {
        currentTime = Date.now() - zeroTime + previousTime;
        hours =  Math.floor(currentTime / 3600000);
        minutes = Math.floor((currentTime % 3600000) / 60000);
        seconds = Math.floor((currentTime % 60000) / 1000);
        millis = currentTime % 1000;
    };

    this.start = function() {
        previousTime = currentTime;
        zeroTime = Date.now();
        run = setInterval(self.nextStep, 4);
        stopped = false;
        paused = false;
    };

    this.pause = function() {
        clearInterval(run);
        run = null;
        paused = true;
    };

    this.stop = function() {
        clearInterval(run);
        stopped = true;
        paused = false;
        stopTime = currentTime;
        var returnObj = {
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            millis: millis
        };
        this.reset();
        return returnObj;
    };

    this.reset = function() {
        clearInterval(run);
        run = null;
        paused = false;
        stopped = true;
        hours = 0;
        minutes = 0;
        seconds = 0;
        millis = 0;
        currentTime = 0;
        splitTime = 0;
        splitNumber = 0;
    };

    this.split = function() {
        splitTime = currentTime;
        splitNumber++;
        return {
            number: splitNumber,
            hours: hours,
            minutes: minutes,
            seconds: seconds,
            millis: millis
        };
    };

    this.getHours = function() {
        return hours;
    };

    this.getMinutes = function() {
        return minutes;
    };

    this.getSeconds = function() {
        return seconds;
    };

    this.getMillis = function() {
        return millis;
    };

    this.isStopped = function() {
        return stopped;
    };

    this.isPaused = function () {
        return paused
    };
}
