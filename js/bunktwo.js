// ==========================================
// INLINEASY - BOOKING SYSTEM
// ==========================================


// ==========================================
// LOAD USER DETAILS
// ==========================================

const userName =
    localStorage.getItem("userName") || "";

const carModel =
    localStorage.getItem("carModel") || "";

const carNumber =
    localStorage.getItem("carNumber") || "";


// ==========================================
// DISPLAY USER DETAILS
// ==========================================

const userNameElement =
    document.getElementById("userName");

const carModelElement =
    document.getElementById("carModel");

const carNumberElement =
    document.getElementById("carNumber");


if (userNameElement) {
    userNameElement.textContent =
        userName || "User";
}

if (carModelElement) {
    carModelElement.textContent =
        carModel || "-";
}

if (carNumberElement) {
    carNumberElement.textContent =
        carNumber || "-";
}


// ==========================================
// DATE
// ==========================================

const dateInput =
    document.getElementById("bookingDate");


const now =
    new Date();


const year =
    now.getFullYear();

const month =
    String(
        now.getMonth() + 1
    ).padStart(2, "0");

const day =
    String(
        now.getDate()
    ).padStart(2, "0");


const todayString =
    `${year}-${month}-${day}`;


// Prevent past dates

if (dateInput) {

    dateInput.min =
        todayString;

}


// ==========================================
// VARIABLES
// ==========================================

let selectedShift = "";

let selectedSlot = "";


// ==========================================
// SAMPLE BOOKED SLOTS
// ==========================================

const bookedSlots = {

    shift1: [
        "12:30 AM",
        "1:20 AM",
        "3:00 AM",
        "8:40 AM",
        "10:10 AM"
    ],

    shift2: [
        "12:20 PM",
        "2:40 PM",
        "4:10 PM",
        "7:30 PM",
        "9:50 PM"
    ]

};


// ==========================================
// SELECT SHIFT
// ==========================================

function selectShift(shift) {

    selectedShift =
        shift;

    selectedSlot =
        "";


    // Remove old active shift

    document
        .querySelectorAll(".shift")
        .forEach(element => {

            element.classList.remove(
                "active"
            );

        });


    // Activate selected shift

    const selectedShiftElement =
        document.getElementById(
            shift
        );


    if (selectedShiftElement) {

        selectedShiftElement.classList.add(
            "active"
        );

    }


    // Generate slots

    generateSlots(
        shift
    );


    // Show slot section

    const slotSection =
        document.getElementById(
            "slotSection"
        );


    if (slotSection) {

        slotSection.style.display =
            "block";

    }

}


// ==========================================
// GENERATE 10-MINUTE SLOTS
// ==========================================

function generateSlots(shift) {

    const slotsContainer =
        document.getElementById(
            "slots"
        );


    if (!slotsContainer) {
        return;
    }


    slotsContainer.innerHTML =
        "";

    selectedSlot =
        "";


    // ======================================
    // SHIFT TIMES
    // ======================================

    let startHour;
    let endHour;


    if (shift === "shift1") {

        // 12 AM - 12 PM

        startHour = 0;
        endHour = 12;

    } else {

        // 12 PM - 12 AM

        startHour = 12;
        endHour = 24;

    }


    // ======================================
    // SELECTED DATE
    // ======================================

    const selectedDate =
        dateInput
            ? dateInput.value
            : "";


    const isToday =
        selectedDate ===
        todayString;


    // ======================================
    // CURRENT TIME
    // ======================================

    const currentMinutes =
        now.getHours() * 60 +
        now.getMinutes();


    // ======================================
    // CREATE SLOTS
    // ======================================

    for (
        let hour = startHour;
        hour < endHour;
        hour++
    ) {

        for (
            let minute = 0;
            minute < 60;
            minute += 10
        ) {

            const slotStartMinutes =
                hour * 60 +
                minute;


            const nextHour =
                hour;

            const nextMinute =
                minute + 10;


            const startTime =
                formatTime(
                    hour,
                    minute
                );


            let endTime;


            if (nextMinute >= 60) {

                endTime =
                    formatTime(
                        nextHour + 1,
                        0
                    );

            } else {

                endTime =
                    formatTime(
                        nextHour,
                        nextMinute
                    );

            }


            const slotText =
                `${startTime} - ${endTime}`;


            const slot =
                document.createElement(
                    "div"
                );


            slot.className =
                "slot";


            slot.textContent =
                slotText;


            // ==================================
            // CHECK SAMPLE BOOKED SLOT
            // ==================================

            const booked =
                bookedSlots[
                    shift
                ]?.some(
                    bookedTime =>
                        bookedTime ===
                        startTime
                );


            // ==================================
            // CHECK CURRENT TIME
            // ==================================

            let pastSlot =
                false;


            if (isToday) {

                /*
                 * Example:
                 * Current time = 8:25 PM
                 *
                 * 8:00 PM  -> disabled
                 * 8:10 PM  -> disabled
                 * 8:20 PM  -> disabled
                 * 8:30 PM  -> available
                 */

                if (
                    slotStartMinutes <=
                    currentMinutes
                ) {

                    pastSlot =
                        true;

                }

            }


            // ==================================
            // DISABLE SLOT
            // ==================================

            if (
                booked ||
                pastSlot
            ) {

                slot.classList.add(
                    "unavailable"
                );

                slot.style.opacity =
                    "0.4";

                slot.style.cursor =
                    "not-allowed";

                if (booked) {

                    slot.title =
                        "Already booked";

                } else {

                    slot.title =
                        "This time has passed";

                }

            }


            // ==================================
            // AVAILABLE SLOT
            // ==================================

            else {

                slot.classList.add(
                    "available"
                );


                slot.onclick =
                    function () {

                        selectSlot(
                            slot,
                            slotText
                        );

                    };

            }


            slotsContainer.appendChild(
                slot
            );

        }

    }

}


// ==========================================
// FORMAT TIME
// ==========================================

function formatTime(
    hour,
    minute
) {

    let displayHour =
        hour % 12;


    if (
        displayHour === 0
    ) {

        displayHour =
            12;

    }


    const minuteString =
        String(
            minute
        ).padStart(
            2,
            "0"
        );


    const ampm =
        hour < 12
            ? "AM"
            : "PM";


    return (
        `${displayHour}:${minuteString} ${ampm}`
    );

}


// ==========================================
// SELECT SLOT
// ==========================================

function selectSlot(
    element,
    time
) {

    // Remove old selection

    document
        .querySelectorAll(
            ".slot.available"
        )
        .forEach(
            slot => {

                slot.classList.remove(
                    "selected"
                );

            }
        );


    // Select new slot

    element.classList.add(
        "selected"
    );


    selectedSlot =
        time;


    // Hide error

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    if (errorMessage) {

        errorMessage.style.display =
            "none";

    }

}


// ==========================================
// CREATE TICKET NUMBER
// ==========================================

function createTicketNumber() {

    return (
        "INL-" +
        Math.floor(
            100000 +
            Math.random() *
            900000
        )
    );

}


// ==========================================
// GET EXISTING BOOKINGS
// ==========================================

function getBookings() {

    try {

        return JSON.parse(
            localStorage.getItem(
                "cngBookings"
            )
        ) || [];

    } catch (error) {

        console.error(
            "Booking data error:",
            error
        );

        return [];

    }

}


// ==========================================
// SAVE BOOKINGS
// ==========================================

function saveBookings(
    bookings
) {

    localStorage.setItem(
        "cngBookings",
        JSON.stringify(
            bookings
        )
    );

}


// ==========================================
// CHECK SLOT ALREADY BOOKED
// ==========================================

function isSlotAlreadyBooked(
    bookingDate,
    bookingTime
) {

    const bookings =
        getBookings();


    return bookings.some(
        booking =>

            booking.bookingDate ===
            bookingDate

            &&

            booking.bookingTime ===
            bookingTime

            &&

            booking.status !==
            "No-Show"

    );

}


// ==========================================
// CONFIRM BOOKING
// ==========================================

function confirmBooking() {

    const bookingDate =
        dateInput
            ? dateInput.value
            : "";


    // ======================================
    // CHECK DATE
    // ======================================

    if (!bookingDate) {

        showError(
            "Please select a booking date."
        );

        return;

    }


    // ======================================
    // CHECK SHIFT
    // ======================================

    if (!selectedShift) {

        showError(
            "Please select Shift-1 or Shift-2."
        );

        return;

    }


    // ======================================
    // CHECK SLOT
    // ======================================

    if (!selectedSlot) {

        showError(
            "Please select an available slot."
        );

        return;

    }


    // ======================================
    // CHECK USER DETAILS
    // ======================================

    if (
        !userName ||
        !carModel ||
        !carNumber
    ) {

        showError(
            "All booking details are required."
        );

        return;

    }


    // ======================================
    // CURRENT TIME FINAL CHECK
    // ======================================

    if (
        bookingDate ===
        todayString
    ) {

        const match =
            selectedSlot.match(
                /^(\d+):(\d+) (AM|PM)/
            );


        if (match) {

            let hour =
                parseInt(
                    match[1]
                );

            const minute =
                parseInt(
                    match[2]
                );

            const ampm =
                match[3];


            if (
                ampm === "PM" &&
                hour !== 12
            ) {

                hour += 12;

            }


            if (
                ampm === "AM" &&
                hour === 12
            ) {

                hour = 0;

            }


            const slotMinutes =
                hour * 60 +
                minute;


            const currentTimeMinutes =
                new Date().getHours() *
                    60 +
                new Date().getMinutes();


            if (
                slotMinutes <=
                currentTimeMinutes
            ) {

                showError(
                    "This slot has already started. Please select the next available slot."
                );

                generateSlots(
                    selectedShift
                );

                return;

            }

        }

    }


    // ======================================
    // CHECK DUPLICATE
    // ======================================

    if (
        isSlotAlreadyBooked(
            bookingDate,
            selectedSlot
        )
    ) {

        showError(
            "This slot has already been booked."
        );

        return;

    }


    // ======================================
    // CREATE TICKET
    // ======================================

    const ticketNumber =
        createTicketNumber();


    // ======================================
    // BOOKING OBJECT
    // ======================================

    const booking = {

        ticketNumber:
            ticketNumber,

        userName:
            userName,

        phoneNumber:
            localStorage.getItem(
                "phoneNumber"
            ) || "",

        carModel:
            carModel,

        carNumber:
            carNumber,

        bookingDate:
            bookingDate,

        bookingShift:
            selectedShift,

        bookingTime:
            selectedSlot,

        bunkName:
            "INLINEASY",

        status:
            "Waiting",

        createdAt:
            new Date().toISOString()

    };


    // ======================================
    // SAVE BOOKING
    // ======================================

    const bookings =
        getBookings();


    bookings.push(
        booking
    );


    saveBookings(
        bookings
    );


    // ======================================
    // SAVE CURRENT BOOKING
    // ======================================

    localStorage.setItem(
        "ticketNumber",
        ticketNumber
    );

    localStorage.setItem(
        "bookingDate",
        bookingDate
    );

    localStorage.setItem(
        "bookingShift",
        selectedShift
    );

    localStorage.setItem(
        "bookingTime",
        selectedSlot
    );

    localStorage.setItem(
        "bunkName",
        "INLINEASY"
    );


    // ======================================
    // GO TO TICKET
    // ======================================

    window.location.href =
        "ticket.html";

}


// ==========================================
// SHOW ERROR
// ==========================================

function showError(
    message
) {

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    if (!errorMessage) {

        alert(message);

        return;

    }


    errorMessage.textContent =
        message;


    errorMessage.style.display =
        "block";

}
// ==========================================
// CONTINUE TO BOOKING THREE
// ==========================================

function continueToBooking() {

    const carNumberInput =
        document.getElementById("carNumber");

    const carModelInput =
        document.getElementById("carModel");

    const errorMessage =
        document.getElementById("errorMessage");


    const carNumber =
        carNumberInput
            ? carNumberInput.value.trim().toUpperCase()
            : "";

    const carModel =
        carModelInput
            ? carModelInput.value.trim()
            : "";


    // ==============================
    // VALIDATE CAR NUMBER
    // ==============================

    if (!carNumber) {

        if (errorMessage) {
            errorMessage.textContent =
                "Please enter your vehicle registration number.";

            errorMessage.style.display =
                "block";
        }

        return;
    }


    // ==============================
    // VALIDATE CAR MODEL
    // ==============================

    if (!carModel) {

        if (errorMessage) {
            errorMessage.textContent =
                "Please enter your vehicle model.";

            errorMessage.style.display =
                "block";
        }

        return;
    }


    // ==============================
    // SAVE VEHICLE DETAILS
    // ==============================

    localStorage.setItem(
        "carNumber",
        carNumber
    );

    localStorage.setItem(
        "carModel",
        carModel
    );


    // ==============================
    // GO TO BOOKING THREE
    // ==============================

    window.location.href =
        "bookingthree.html";
}
