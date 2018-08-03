// from https://stackoverflow.com/a/21739514
function roundTimeQuarterHour(time) {
    time = time || new Date()
    var timeToReturn = new Date(time)
    timeToReturn.setMilliseconds(Math.ceil(time.getMilliseconds() / 1000) * 1000)
    timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60)
    timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 15) * 15)
    return timeToReturn
}

// COUNTDOWN
// Set the date we're counting down to
var countDownDate = roundTimeQuarterHour().getTime();

// Update the count down every 1 second
var x = setInterval(function () {

    // Get todays date and time
    var now = new Date().getTime();

    // Find the distance between now an the count down date
    var distance = Number(countDownDate - now);

    // Time calculations for minutes and seconds
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    if (seconds < 10) {
        seconds = "0" + seconds;
    }

    // Display clock
    document.getElementById("minutes").innerText = minutes;
    document.getElementById("seconds").innerText = seconds;

    var warning = `<h6 class="card-title ALERT_CLASS">Your GULD will be credited at the exchange rate given by <a href="https://coinmarketcap.com" target="_blank">coinmarketcap</a> at the start of the 15 minute window when the transaction is first witnessed by isysd, or when the first confirmation is received, whichever is first.</h6>`
    if (distance < 0) {
        countDownDate = roundTimeQuarterHour().getTime();
    } else if (distance < 300000) {
        document.getElementById("time-warning").innerHTML = warning.replace('ALERT_CLASS', 'alert-danger')
    } else if (distance < 600000) {
        document.getElementById("time-warning").innerHTML = warning.replace('ALERT_CLASS', 'alert-warning')
    } else {
        document.getElementById("time-warning").innerHTML = warning.replace('ALERT_CLASS', 'alert-success')
    }
}, 1000);
