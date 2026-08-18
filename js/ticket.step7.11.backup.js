// ==========================================
// INLINEASY - TICKET.JS
// ==========================================


// ==========================================
// GET BOOKING DATA
// ==========================================

const customerName =
    localStorage.getItem("userName") ||
    "Guest";


const mobileNumber =
    localStorage.getItem("phoneNumber") ||
    "Not available";


const bunkName =
    localStorage.getItem("bunkName") ||
    "INLINEASY";


const carName =
    localStorage.getItem("carModel") ||
    "Car";


const carNumber =
    localStorage.getItem("carNumber") ||
    "Not available";


const bookingDate =
    localStorage.getItem("bookingDate") ||
    "Not selected";


const bookingTime =
    localStorage.getItem("bookingTime") ||
    "Not selected";


// ==========================================
// GET REAL TOKEN FROM FLASK
// ==========================================

const tokenNumber =
    localStorage.getItem("token") ||
    localStorage.getItem("ticketNumber") ||
    "TOKEN ERROR";


// ==========================================
// GET BOOKING ID
// ==========================================

const bookingId =
    localStorage.getItem("bookingId") ||
    "";


// ==========================================
// SHOW BOOKING DETAILS
// ==========================================

const customerNameElement =
    document.getElementById(
        "customerName"
    );

if (customerNameElement) {

    customerNameElement.textContent =
        customerName;

}


const mobileNumberElement =
    document.getElementById(
        "mobileNumber"
    );

if (mobileNumberElement) {

    mobileNumberElement.textContent =
        maskMobile(
            mobileNumber
        );

}


const bunkNameElement =
    document.getElementById(
        "bunkName"
    );

if (bunkNameElement) {

    bunkNameElement.textContent =
        bunkName;

}


const carNameElement =
    document.getElementById(
        "carName"
    );

if (carNameElement) {

    carNameElement.textContent =
        carName;

}


const carNumberElement =
    document.getElementById(
        "carNumber"
    );

if (carNumberElement) {

    carNumberElement.textContent =
        carNumber;

}


const bookingDateElement =
    document.getElementById(
        "bookingDate"
    );

if (bookingDateElement) {

    bookingDateElement.textContent =
        bookingDate;

}


const bookingTimeElement =
    document.getElementById(
        "bookingTime"
    );

if (bookingTimeElement) {

    bookingTimeElement.textContent =
        bookingTime;

}


const tokenElement =
    document.getElementById(
        "tokenNumber"
    );

if (tokenElement) {

    tokenElement.textContent =
        tokenNumber;

}


// ==========================================
// MASK MOBILE
// ==========================================

function maskMobile(number) {

    if (
        !number ||
        number.length < 5
    ) {

        return number;

    }


    return (
        "******" +
        number.slice(-4)
    );

}


// ==========================================
// QR CODE DATA
// ==========================================

const qrData =
    JSON.stringify({

        bookingId:
            bookingId,

        token:
            tokenNumber,

        mobile:
            mobileNumber,

        carNumber:
            carNumber,

        date:
            bookingDate,

        time:
            bookingTime

    });


// ==========================================
// CREATE QR CODE
// ==========================================

const qrElement =
    document.getElementById(
        "qrcode"
    );


if (
    qrElement &&
    typeof QRCode !== "undefined"
) {

    new QRCode(
        qrElement,
        {

            text:
                qrData,

            width:
                170,

            height:
                170

        }
    );

}


// ==========================================
// DOWNLOAD / PRINT TICKET
// ==========================================

function downloadTicket() {

    window.print();

}
