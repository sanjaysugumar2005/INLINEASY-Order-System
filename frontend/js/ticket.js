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
// ==========================================
// DOWNLOAD EXACT PREMIUM INLINEASY TICKET
// ONE PAGE - SAME DESIGN
// ==========================================

async function downloadTicket() {

    const ticket = document.getElementById("ticket");

    if (!ticket) {
        alert("Ticket not found.");
        return;
    }

    if (
        typeof html2canvas === "undefined" ||
        typeof window.jspdf === "undefined"
    ) {
        alert("PDF service is not available. Please check your internet connection.");
        return;
    }

    const downloadButton =
        document.querySelector(".download-btn");

    if (downloadButton) {
        downloadButton.style.display = "none";
    }

    try {

        const canvas = await html2canvas(ticket, {
            scale: 2,
            useCORS: true,
            allowTaint: false,
            backgroundColor: "#0b0b0b",
            logging: false
        });

        const imageData =
            canvas.toDataURL("image/png", 1.0);

        const { jsPDF } = window.jspdf;

        /*
         * Create PDF page using the ticket's
         * exact aspect ratio.
         */

        const ticketWidth = canvas.width;
        const ticketHeight = canvas.height;

        const pdfWidth = 100;
        const pdfHeight =
            (ticketHeight / ticketWidth) * pdfWidth;

        const pdf = new jsPDF({
            orientation:
                pdfHeight > pdfWidth
                    ? "portrait"
                    : "landscape",

            unit: "mm",

            format: [
                pdfWidth,
                pdfHeight
            ]
        });

        pdf.addImage(
            imageData,
            "PNG",
            0,
            0,
            pdfWidth,
            pdfHeight
        );

        const token =
            tokenNumber &&
            tokenNumber !== "TOKEN ERROR"
                ? tokenNumber
                : "Booking";

        pdf.save(
            `INLINEASY-Ticket-${token}.pdf`
        );

    }

    catch (error) {

        console.error(
            "INLINEASY PDF Error:",
            error
        );

        alert(
            "Unable to download ticket. Please try again."
        );

    }

    finally {

        if (downloadButton) {
            downloadButton.style.display = "";

        }

    }

}

// ==========================================
// LIVE BOOKING STATUS
// ==========================================

async function loadLiveStatus() {

    if (!tokenNumber || tokenNumber === "TOKEN ERROR") {
        return;
    }

    try {

        const response = await fetch(
            `http://127.0.0.1:5000/api/booking/${encodeURIComponent(tokenNumber)}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            console.error("Unable to get booking status");
            return;
        }

        const booking = data.booking;

        console.log(
            "INLINEASY LIVE STATUS:",
            booking.status
        );

        let statusElement =
            document.getElementById("bookingStatus");

        if (!statusElement) {

            statusElement =
                document.createElement("div");

            statusElement.id =
                "bookingStatus";

            statusElement.style.marginTop =
                "20px";

            statusElement.style.padding =
                "15px";

            statusElement.style.borderRadius =
                "12px";

            statusElement.style.textAlign =
                "center";

            statusElement.style.fontWeight =
                "bold";

            const ticketContainer =
                document.querySelector(".ticket");

            if (ticketContainer) {
                ticketContainer.appendChild(
                    statusElement
                );
            }

        }

        if (booking.status === "WAITING") {

            statusElement.textContent =
                "🟡 WAITING — Please wait for your turn";

        }

        else if (booking.status === "CALLED") {

            statusElement.textContent =
                "🟢 YOUR TOKEN IS CALLED — Please proceed to the CNG station";

        }

        else if (booking.status === "COMPLETED") {

            statusElement.textContent =
                "✅ BOOKING COMPLETED";

        }

        else if (booking.status === "NO-SHOW") {

            statusElement.textContent =
                "❌ NO-SHOW";

        }

        else if (booking.status === "CANCELLED") {

            statusElement.textContent =
                "❌ BOOKING CANCELLED";

        }

        else {

            statusElement.textContent =
                "📋 STATUS: " +
                booking.status;

        }

    }

    catch (error) {

        console.error(
            "Live status error:",
            error
        );

    }

}


// ==========================================
// START LIVE STATUS
// ==========================================

loadLiveStatus();


// Refresh every 5 seconds
setInterval(
    loadLiveStatus,
    5000
);
