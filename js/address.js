// defaults
window.quote = 'USD'
window.pay = 'BTC'
window.base = 'GULD'

// from https://stackoverflow.com/a/21739514
function roundTimeQuarterHour(time) {
    time = time || new Date()
    var timeToReturn = new Date(time)
    timeToReturn.setMilliseconds(Math.ceil(time.getMilliseconds() / 1000) * 1000)
    timeToReturn.setSeconds(Math.ceil(timeToReturn.getSeconds() / 60) * 60)
    timeToReturn.setMinutes(Math.ceil(timeToReturn.getMinutes() / 15) * 15)
    return timeToReturn
}

function filterPricesByTime (line) {
  if (!line.startsWith('P ')) return false
  else {
    var pdate = line.substring(2, 12)
    var apdate = pdate.split('/')
    pdate = `${apdate[1]}/${apdate[2]}/${apdate[0]}`
    var now = Date.now()
    var ptime = new Date(pdate).getTime()
    if (now >= ptime) {
      return true
    } else return false
  }
}

function parseCommodityPrice (pricef, commodity = 'GULD', quote = 'USD') {
  var pricefl
  var pricea
  var amtstr
  var re
  commodity = commodity.toUpperCase()
  quote = quote.toUpperCase()
  pricef = pricef.split('\n').reverse()
  pricefl = pricef.filter(filterPricesByTime)
  var res = `[0-9.]*[ ]{0,1}${quote}$`.replace(commodity, '')
  re = new RegExp(res, 'm')
  pricea = re.exec(pricefl.join('\n'))
  if (pricea && pricea.length > 0 && pricea[0].length > 0) {
    amtstr = pricea[0].replace(commodity, '').trim()
    var amt = amtstr.replace(quote, '').trim()
    return amt
  } else throw new RangeError(`Price not found for commodity ${commodity}`)
}

function updatePrice (quote, base, market='coinmarketcap') {
  quote = quote || window.quote
  base = base || window.base
  console.log(quote)
  console.log(base)
  if (base === 'GULD') market = 'guld-core'
  function process (data) {
    console.log(data)
    var activePrices = document.getElementsByClassName("active-price");

    for(var i = activePrices.length - 1; i >= 0; i--) {
        activePrices[i].innerText = parseCommodityPrice(data, base, quote)
    }

  }
  $.ajax({
    url: `/market/${quote}/${base}/prices/${market}.dat`,
  })
  .done(process)
  .fail(function() {
    alert("Ajax failed to fetch data")
  })
}

// COUNTDOWN
// Set the date we're counting down to
var countDownDate = roundTimeQuarterHour().getTime();

$(document).ready(function () {
    updatePrice()
})

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
    document.getElementById("minutes").innerText = minutes
    document.getElementById("seconds").innerText = seconds

    var warning = `<h6 class="card-title ALERT_CLASS">Your GULD will be credited at the exchange rate given by <a href="https://coinmarketcap.com" target="_blank">coinmarketcap</a> at the start of the 15 minute window when the transaction is first witnessed by isysd, or when the first confirmation is received, whichever is first.</h6>`
    if (distance < 0) {
        countDownDate = roundTimeQuarterHour().getTime()
        updatePrice()
    } else if (distance < 300000) {
        document.getElementById("time-warning").innerHTML = warning.replace('ALERT_CLASS', 'alert-danger')
    } else if (distance < 600000) {
        document.getElementById("time-warning").innerHTML = warning.replace('ALERT_CLASS', 'alert-warning')
    } else {
        document.getElementById("time-warning").innerHTML = warning.replace('ALERT_CLASS', 'alert-success')
    }
}, 1000);
