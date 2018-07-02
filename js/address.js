    // QR code generation
    new QRCode(document.getElementById("qrcode"), "https://guld.io");


    // COUNTDOWN
    // Set the date we're counting down to
    var countDownDate = new Date("Sep 5, 2018 15:37:25").getTime();

    // Update the count down every 1 second
    var x = setInterval(function () {

        // Get todays date and time
        var now = new Date().getTime();

        // Find the distance between now an the count down date
        var distance = countDownDate - now;

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

        // If the count down is finished, write some text 
        if (distance < 0) {
            clearInterval(x);
            console.log("EXPIRED");
        }
    }, 1000);