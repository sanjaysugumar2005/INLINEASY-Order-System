// ==========================================
// INLINEASY
// STEP 5 - BOOKING CONFIRMATION
// ==========================================


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

function loadBookingData() {

    // ======================================
    // GET SAVED DATA
    // ======================================

    const userName =
        localStorage.getItem(
            "userName"
        ) || "Not Available";


    const phoneNumber =
        localStorage.getItem(
            "phoneNumber"
        ) || "Not Available";


    const carModel =
        localStorage.getItem(
            "carModel"
        ) || "Not Available";


    const carNumber =
        localStorage.getItem(
            "carNumber"
        ) || "Not Available";


    const bookingDate =
        localStorage.getItem(
            "bookingDate"
        ) || "Not Available";


    const bookingShift =
        localStorage.getItem(
            "bookingShift"
        ) || "Not Available";


    const bookingTime =
        localStorage.getItem(
            "bookingTime"
        ) || "Not Available";


    const bunkName =
        "INLINEASY";


    // ======================================
    // GET TICKET NUMBER
    // ======================================

    let ticketNumber =
        localStorage.getItem(
            "ticketNumber"
        );


    // ======================================
    // CREATE TICKET IF MISSING
    // ======================================

    if (!ticketNumber) {

        ticketNumber =
            generateTicketNumber();


        localStorage.setItem(
            "ticketNumber",
            ticketNumber
        );

    }


    // ======================================
    // DISPLAY TICKET
    // ======================================

    const tokenElement =
        document.getElementById(
            "tokenNumber"
        );


    if (tokenElement) {

        tokenElement.textContent =
            ticketNumber;

    }


    // ======================================
    // DISPLAY CAR
    // ======================================

    const carElement =
        document.getElementById(
            "carName"
        );


    if (carElement) {

        carElement.textContent =
            carModel;

    }


    // ======================================
    // DISPLAY CAR NUMBER
    // ======================================

    const carNumberElement =
        document.getElementById(
            "carNumber"
        );


    if (carNumberElement) {

        carNumberElement.textContent =
            carNumber;

    }


    // ======================================
    // DISPLAY DATE
    // ======================================

    const dateElement =
        document.getElementById(
            "bookingDate"
        );


    if (dateElement) {

        dateElement.textContent =
            bookingDate;

    }


    // ======================================
    // DISPLAY TIME
    // ======================================

    const timeElement =
        document.getElementById(
            "bookingTime"
        );


    if (timeElement) {

        timeElement.textContent =
            bookingTime;

    }


    // ======================================
    // DISPLAY BUNK
    // ======================================

    const bunkElement =
        document.getElementById(
            "bunkName"
        );


    if (bunkElement) {

        bunkElement.textContent =
            bunkName;

    }


    // ======================================
    // CREATE BOOKING OBJECT
    // ======================================

    const booking = {

        ticketNumber:
            ticketNumber,

        userName:
            userName,

        phoneNumber:
            phoneNumber,

        carModel:
            carModel,

        carNumber:
            carNumber,

        bookingDate:
            bookingDate,

        bookingShift:
            bookingShift,

        bookingTime:
            bookingTime,

        bunkName:
            bunkName,

        status:
            "Waiting",

        createdAt:
            new Date().toISOString()

    };


    // ======================================
    // SAVE CURRENT BOOKING
    // ======================================

    localStorage.setItem(
        "currentBooking",
        JSON.stringify(
            booking
        )
    );


    // ======================================
    // SAVE TO ALL BOOKINGS
    // ======================================

    saveBookingToList(
        booking
    );


    // ======================================
    // GENERATE QR
    // ======================================

    generateQR(
        booking
    );

}


// ==========================================
// GENERATE TICKET NUMBER
// ==========================================

function generateTicketNumber() {

    const randomNumber =
        Math.floor(
            100000 +
            Math.random() * 900000
        );


    return "INLINE-" +
        randomNumber;

}


// ==========================================
// SAVE BOOKING TO LIST
// ==========================================

function saveBookingToList(
    booking
) {

    let bookings =
        JSON.parse(
            localStorage.getItem(
                "cngBookings"
            )
        ) || [];


    // Check if ticket already exists

    const alreadyExists =
        bookings.some(
            item =>
                item.ticketNumber ===
                booking.ticketNumber
        );


    // Add only once

    if (!alreadyExists) {

        bookings.push(
            booking
        );


        localStorage.setItem(
            "cngBookings",
            JSON.stringify(
                bookings
            )
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


    // Clear previous QR

    qrContainer.innerHTML =
        "";


    // Check QR library

    if (
        typeof QRCode ===
        "undefined"
    ) {

        qrContainer.innerHTML = `

            <p style="
                color:#000000;
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
    // QR DATA
    // ======================================

    const qrData =
        JSON.stringify({

            ticketNumber:
                booking.ticketNumber,

            userName:
                booking.userName,

            phoneNumber:
                booking.phoneNumber,

            carModel:
                booking.carModel,

            carNumber:
                booking.carNumber,

            bookingDate:
                booking.bookingDate,

            bookingShift:
                booking.bookingShift,

            bookingTime:
                booking.bookingTime,

            bunkName:
                booking.bunkName,

            status:
                booking.status

        });


    // ======================================
    // CREATE QR
    // ======================================

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