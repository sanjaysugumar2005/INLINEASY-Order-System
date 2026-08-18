// ======================================
// INLINEASY - BOOKING SYSTEM
// ======================================


// ======================================
// LOAD USER DETAILS
// ======================================

const userName =
    localStorage.getItem("userName");

const carModel =
    localStorage.getItem("carModel");

const carNumber =
    localStorage.getItem("carNumber");


// Display user information

const userNameElement =
    document.getElementById("userName");

const carModelElement =
    document.getElementById("carModel");

const carNumberElement =
    document.getElementById("carNumber");


if (userNameElement && userName) {
    userNameElement.textContent =
        userName;
}


if (carModelElement && carModel) {
    carModelElement.textContent =
        carModel;
}


if (carNumberElement && carNumber) {
    carNumberElement.textContent =
        carNumber;
}


// ======================================
// DATE
// ======================================

const dateInput =
    document.getElementById("bookingDate");


const today =
    new Date();


const year =
    today.getFullYear();


const month =
    String(
        today.getMonth() + 1
    ).padStart(2, "0");


const day =
    String(
        today.getDate()
    ).padStart(2, "0");


const todayString =
    `${year}-${month}-${day}`;


// Prevent past dates

if (dateInput) {
    dateInput.min =
        todayString;
}


// ======================================
// VARIABLES
// ======================================

let selectedShift = "";

let selectedSlot = "";


// ======================================
// SAMPLE BOOKED SLOTS
// ======================================
//
// Temporary testing data.
// Later this will come from Flask + database.
//

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


// ======================================
// SELECT SHIFT
// ======================================

function selectShift(shift) {

    selectedShift =
        shift;


    selectedSlot =
        "";


    // Remove previous active shift

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


// ======================================
// GENERATE 10-MINUTE SLOTS
// ======================================

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


    let startHour;

    let endHour;


    if (shift === "shift1") {

        // 12:00 AM → 12:00 PM

        startHour = 0;

        endHour = 12;

    } else {

        // 12:00 PM → 12:00 AM

        startHour = 12;

        endHour = 24;

    }


    // Generate 10-minute slots

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

            const time =
                formatTime(
                    hour,
                    minute
                );


            const slot =
                document.createElement(
                    "button"
                );


            slot.type =
                "button";


            slot.classList.add(
                "slot"
            );


            // ==================================
            // CHECK BOOKED SLOT
            // ==================================

            const isBooked =
                bookedSlots[shift]
                &&
                bookedSlots[shift]
                    .includes(time);


            if (isBooked) {

                // BOOKED

                slot.classList.add(
                    "booked"
                );


                slot.textContent =
                    `🔴 ${time}`;


                slot.disabled =
                    true;


            } else {

                // AVAILABLE

                slot.classList.add(
                    "available"
                );


                slot.textContent =
                    `🟢 ${time}`;


                slot.addEventListener(
                    "click",
                    function () {

                        selectSlot(
                            slot,
                            time
                        );

                    }
                );

            }


            slotsContainer.appendChild(
                slot
            );

        }

    }

}


// ======================================
// FORMAT TIME
// ======================================

function formatTime(
    hour,
    minute
) {

    let displayHour =
        hour % 12;


    if (displayHour === 0) {

        displayHour = 12;

    }


    const minuteString =
        String(minute)
        .padStart(
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


// ======================================
// SELECT SLOT
// ======================================

function selectSlot(
    element,
    time
) {

    // Remove previous selection

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


    // Select current slot

    element.classList.add(
        "selected"
    );


    selectedSlot =
        time;


    // Hide old error

    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    if (errorMessage) {

        errorMessage.style.display =
            "none";

    }

}


// ======================================
// CREATE TICKET NUMBER
// ======================================

function createTicketNumber() {

    return (
        "INL-" +
        Math.floor(
            100000 +
            Math.random() * 900000
        )
    );

}


// ======================================
// GET EXISTING BOOKINGS
// ======================================

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


// ======================================
// SAVE BOOKINGS
// ======================================

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


// ======================================
// CHECK SLOT ALREADY BOOKED
// ======================================

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


// ======================================
// CONFIRM BOOKING
// ======================================

function confirmBooking() {

    const bookingDate =
        dateInput
            ? dateInput.value
            : "";


    const errorMessage =
        document.getElementById(
            "errorMessage"
        );


    // ==================================
    // CHECK DATE
    // ==================================

    if (!bookingDate) {

        showError(
            "Please select a booking date."
        );

        return;

    }


    // ==================================
    // CHECK SHIFT
    // ==================================

    if (!selectedShift) {

        showError(
            "Please select Shift-1 or Shift-2."
        );

        return;

    }


    // ==================================
    // CHECK SLOT
    // ==================================

    if (!selectedSlot) {

        showError(
            "Please select an available 10-minute slot."
        );

        return;

    }


    // ==================================
    // CHECK USER DETAILS
    // ==================================

    if (
        !userName ||
        !carModel ||
        !carNumber
    ) {

        showError(
            "User or car details are missing."
        );

        return;

    }


    // ==================================
    // CHECK DUPLICATE SLOT
    // ==================================

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


    // ==================================
    // CREATE TICKET
    // ==================================

    const ticketNumber =
        createTicketNumber();


    // ==================================
    // BOOKING OBJECT
    // ==================================

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


    // ==================================
    // SAVE BOOKING
    // ==================================

    const bookings =
        getBookings();


    bookings.push(
        booking
    );


    saveBookings(
        bookings
    );


    // ==================================
    // SAVE CURRENT BOOKING
    // ==================================

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


    // ==================================
    // GO TO TICKET
    // ==================================

    window.location.href =
        "ticket.html";

}


// ======================================
// SHOW ERROR
// ======================================

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