// ==========================================
// INLINEASY
// STEP 5 - BOOKING CONFIRMATION
// BACKEND CONNECTED
// ==========================================

const API_URL = "http://127.0.0.1:5000";


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadBookingData();

    }
);


// ==========================================
// LOAD BOOKING DATA
// ==========================================

async function loadBookingData() {

    // ======================================
    // GET REAL BACKEND TOKEN
    // ======================================

    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("ticketNumber");

    if (!token) {

        console.error(
            "No booking token found."
        );

        alert(
            "❌ Booking token not found."
        );

        return;
    }


    // ======================================
    // DISPLAY TOKEN
    // ======================================

    const tokenElement =
        document.getElementById("tokenNumber");

    if (tokenElement) {

        tokenElement.textContent =
            token;

    }


    // ======================================
    // DISPLAY LOCAL BOOKING DATA
    // ======================================

    const carModel =
        localStorage.getItem("carModel") ||
        "Not Available";

    const carNumber =
        localStorage.getItem("carNumber") ||
        "Not Available";

    const bookingDate =
        localStorage.getItem("bookingDate") ||
        "Not Available";

    const bookingTime =
        localStorage.getItem("bookingTime") ||
        "Not Available";

    const bunkName =
        localStorage.getItem("bunkName") ||
        "INLINEASY";


    const carElement =
        document.getElementById("carName");

    if (carElement) {
        carElement.textContent =
            carModel;
    }


    const carNumberElement =
        document.getElementById("carNumber");

    if (carNumberElement) {
        carNumberElement.textContent =
            carNumber;
    }


    const dateElement =
        document.getElementById("bookingDate");

    if (dateElement) {
        dateElement.textContent =
            bookingDate;
    }


    const timeElement =
        document.getElementById("bookingTime");

    if (timeElement) {
        timeElement.textContent =
            bookingTime;
    }


    const bunkElement =
        document.getElementById("bunkName");

    if (bunkElement) {
        bunkElement.textContent =
            bunkName;
    }


    // ======================================
    // GET REAL BOOKING FROM FLASK
    // ======================================

    try {

        const response =
            await fetch(
                `${API_URL}/api/booking/${encodeURIComponent(token)}`
            );


        const data =
            await response.json();


        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Booking not found."
            );

        }


        const booking =
            data.booking;


        console.log(
            "INLINEASY booking:",
            booking
        );


        // ==================================
        // SAVE REAL BOOKING ID
        // ==================================

        localStorage.setItem(
            "bookingId",
            booking.id
        );


        // ==================================
        // UPDATE LOCAL DATA FROM BACKEND
        // ==================================

        localStorage.setItem(
            "token",
            booking.token
        );

        localStorage.setItem(
            "ticketNumber",
            booking.token
        );


        // ==================================
        // UPDATE DISPLAY
        // ==================================

        if (carElement) {

            carElement.textContent =
                booking.car_name;

        }


        if (carNumberElement) {

            carNumberElement.textContent =
                booking.car_number;

        }


        if (dateElement) {

            dateElement.textContent =
                booking.booking_date;

        }


        if (timeElement) {

            timeElement.textContent =
                booking.booking_time;

        }


        if (bunkElement) {

            bunkElement.textContent =
                booking.bunk;

        }


        // ==================================
        // GENERATE REAL QR
        // ==================================

        generateQR(
            booking
        );


        // ==================================
        // SAVE CURRENT BOOKING
        // ==================================

        localStorage.setItem(
            "currentBooking",
            JSON.stringify(booking)
        );


        console.log(
            "Booking loaded successfully:",
            booking.token
        );


    } catch (error) {

        console.error(
            "Step 5 booking error:",
            error
        );


        alert(
            "❌ Cannot connect to INLINEASY server.\n\n" +
            "Make sure Flask is running on port 5000."
        );

    }

}


// ==========================================
// GENERATE QR CODE
// ==========================================

function generateQR(
    booking
) {

    const qrContainer =
        document.getElementById(
            "qrcode"
        );


    if (!qrContainer) {

        console.error(
            "QR container not found."
        );

        return;

    }


    qrContainer.innerHTML =
        "";


    if (
        typeof QRCode ===
        "undefined"
    ) {

        qrContainer.innerHTML = `

            <p style="
                color:#000;
                font-size:13px;
                text-align:center;
                padding:20px;
            ">

                QR Code library failed to load.

            </p>

        `;

        console.error(
            "QRCode library not loaded."
        );

        return;

    }


    // ======================================
    // QR CONTAINS REAL TOKEN
    // ======================================

    const qrData =
        JSON.stringify({

            token:
                booking.token,

            bookingId:
                booking.id,

            name:
                booking.name,

            mobile:
                booking.mobile,

            car:
                booking.car_name,

            carNumber:
                booking.car_number,

            date:
                booking.booking_date,

            time:
                booking.booking_time,

            bunk:
                booking.bunk

        });


    new QRCode(
        qrContainer,
        {

            text:
                qrData,

            width:
                200,

            height:
                200,

            colorDark:
                "#000000",

            colorLight:
                "#ffffff",

            correctLevel:
                QRCode.CorrectLevel.H

        }
    );

}


// ==========================================
// BACK TO HOME
// ==========================================

function goHome() {

    window.location.href =
        "index.html";

}
// ==========================================
// STEP 9.2 - LIVE QUEUE
// ==========================================

async function loadLiveQueue() {

    const token =
        localStorage.getItem("token") ||
        localStorage.getItem("ticketNumber");

    if (!token) {
        return;
    }

    try {

        const response =
            await fetch(
                `${API_URL}/api/queue`
            );

        const data =
            await response.json();

        if (
            !response.ok ||
            !data.success
        ) {

            throw new Error(
                data.message ||
                "Queue loading failed"
            );

        }


        // ==================================
        // CURRENT CALLED TOKEN
        // ==================================

        const calledTokenElement =
            document.getElementById(
                "currentCalledToken"
            );

        if (calledTokenElement) {

            if (
                data.called &&
                data.called.length > 0
            ) {

                const latestCalled =
                    data.called[
                        data.called.length - 1
                    ];

                calledTokenElement.textContent =
                    latestCalled.token;

            } else {

                calledTokenElement.textContent =
                    "NONE";

            }

        }


        // ==================================
        // WAITING COUNT
        // ==================================

        const waitingElement =
            document.getElementById(
                "customersWaiting"
            );

        if (waitingElement) {

            waitingElement.textContent =
                data.waiting
                    ? data.waiting.length
                    : 0;

        }


        // ==================================
        // FIND MY BOOKING
        // ==================================

        const allBookings =
            data.bookings || [];


        const myBooking =
            allBookings.find(
                booking =>
                    booking.token === token
            );


        const statusElement =
            document.getElementById(
                "customerQueueStatus"
            );


        if (
            statusElement &&
            myBooking
        ) {

            statusElement.textContent =
                myBooking.status;

        }


        console.log(
            "INLINEASY live queue:",
            data
        );


    } catch (error) {

        console.error(
            "Live queue error:",
            error
        );

    }

}


// ==========================================
// START LIVE QUEUE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadLiveQueue();


        setInterval(
            loadLiveQueue,
            5000
        );

    }
);
