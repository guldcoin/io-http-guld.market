// defaults
window.quote = 'USD'
window.pay = 'BTC'
window.base = 'GULD'
window.lastActive = 'quote'
window.bases = {
  'active': 'GULD',
  'GULD': {
    'image': '/img/guld.svg',
    'addresses': {
      BTC: '1FVa2fGZqVzDXer8HirMcKSbDcfR4R4zNK',
      DASH: 'XgUUUh7tqngC6SZ9uFMZjkQvRRuzdee8A4',
      ETH: '0x4cddc8fe277b56f4c2e229b943d8813fc666773a'
    }
  },
  'ISYSD': {
    'image': '/img/wizard-head.png',
    'addresses': {
      BTC: '1HcsB8bKB6tVMcYLnixjRrFzxiqMn44r4x',
      DASH: 'Xie5ZLAaBkXHeVh3qdhJ4jkX4gYMGJfJ2q',
      ETH: '0xb6585cD2a3D4ab6568dD607b154eaC688D5f0C2d'
    }
  }
}

window.quotes = {
  'active': 'BTC',
  'BTC': {
    'image': '/img/btc.svg'
  },
  'DASH': {
    'image': '/img/dash.png'
  },
  'ETH': {
    'image': '/img/eth.png'
  }
}

window.prices = {
  'USD': {'BTC': 0, 'DASH': 0, 'ETH': 0, 'GULD': 0, 'ISYSD': 0}, 
  'BTC': {'BTC': 0, 'DASH': 0, 'ETH': 0, 'GULD': 0, 'ISYSD': 0}, 
  'DASH': {'BTC': 0, 'DASH': 0, 'ETH': 0, 'GULD': 0, 'ISYSD': 0}, 
  'ETH': {'BTC': 0, 'DASH': 0, 'ETH': 0, 'GULD': 0, 'ISYSD': 0}, 
  'ISYSD': {'BTC': 0, 'DASH': 0, 'ETH': 0, 'GULD': 0, 'ISYSD': 0}, 
  'GULD': {'BTC': 0, 'DASH': 0, 'ETH': 0, 'GULD': 0, 'ISYSD': 0}
}

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

function updatePrices (pay, base, market='coinmarketcap') {
  if (pay === quote) return updatePrice(pay, base, market)
  else {
    var bp = updatePrice
  }
}

function updatePrice (quote, base, market='coinmarketcap') {
  quote = quote || window.quote
  base = base || window.base
  if (base === 'GULD') market = 'guld-core'
  function process (data) {
    var activePrices = document.getElementsByClassName("active-price");
    for(var i = activePrices.length - 1; i >= 0; i--) {
        activePrices[i].innerText = parseCommodityPrice(data, base, quote)
        window.prices[quote][base] = Number(activePrices[i].innerText)
    }
  }
  $.ajax({
    url: `/market/${quote}/${base}/prices/${market}.dat`,
  })
  .done(process)
  .fail(function() {
    console.log("Ajax failed to fetch data")
  })
}

function updateAmounts () {
  var depAmt = document.getElementById('deposit-amount')
  var recAmt = document.getElementById('receive-amount')
  
  depAmt.innerText = `${}`
}

function updateAssets (quote, base) {
  window.quotes.active = quote || window.quotes.active
  window.bases.active = base || window.bases.active
  loadAssets()
}

function loadAssets () {
  var card = document.getElementById('qr-card')
  var qqr = document.getElementById('quote-logo-active')
  qqr.src = window.quotes[window.quotes.active].image
  var bqr = document.getElementById('base-logo-active')
  bqr.src = window.bases[window.bases.active].image

  card.innerHTML = `<a href="${window.quotes.active.toLowerCase()}://${window.bases[window.bases.active].addresses[window.quotes.active]}">
    <div class="card-block">
        <h4 class="card-title">${window.bases[window.bases.active].addresses[window.quotes.active]}</h4>
    </div>
    <div class="text-center mt-3">
        <img src="img/address/${window.bases[window.bases.active].addresses[window.quotes.active]}.png" alt="${window.bases[window.bases.active].addresses[window.quotes.active]}" class="card-img-top qrcode">
    </div>
</a>
`
}

function loadAssetList () {
  var qel = document.getElementById('quote-list')
  qel.innerHTML = ''
  var qlist = Object.keys(window.quotes).filter(e => e !== 'active')
  for (var q = 0; q < qlist.length; q++) {
    var quote = qlist[q]
    qel.innerHTML = `${qel.innerHTML}
<div class="card card-asset">
  <a onClick="javascript: updateAssets('${quote}')"><img class="card-img-top" src="${window.quotes[quote].image}" alt="Deposit ${quote}" title="Deposit ${quote}"></a>
</div>
`
  }
  var bel = document.getElementById('base-list')
  bel.innerHTML = ''
  var blist = Object.keys(window.bases).filter(e => e !== 'active')
  for (var b = 0; b < blist.length; b++) {
    var base = blist[b]
    bel.innerHTML = `${bel.innerHTML}
<div class="card card-asset">
  <a onClick="javascript: updateAssets(undefined, '${base}')"><img class="card-img-top" src="${window.bases[base].image}" alt="Receive ${base}" title="Receive ${base}"></a>
</div>
`
  }
}

// COUNTDOWN
// Set the date we're counting down to
var countDownDate = roundTimeQuarterHour().getTime();

$(document).ready(function () {
    loadAssetList()
    updatePrice()
    loadAssets()
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
    var warning = `<h6 class="card-title ALERT_CLASS">Your GULD will be credited at the exchange rate given by <a href="https://coinmarketcap.com" target="_blank">coinmarketcap</a> at the start of the 15 minute window when the transaction is first witnessed. <a href="https://guld.legal/contract/template/trade/INTERNATIONAL_SALE_GOODS_U1000.html">Sales Agreement</a></h6>`
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
