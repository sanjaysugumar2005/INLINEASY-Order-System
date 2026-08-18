// ==========================================
// INLINEASY - ADMIN DASHBOARD
// ==========================================


// ==========================================
// GET BOOKINGS
// ==========================================

function getBookings() {

    try {

        return JSON.parse(
            localStorage.getItem("cngBookings")
        ) || [];

    } catch (error) {

        console.error(
            "Error reading bookings:",
            error
        );

        return [];
    }
}


// ==========================================
// SAVE BOOKINGS
// ==========================================

function saveBookings(bookings) {

    localStorage.setItem(
        "cngBookings",
        JSON.stringify(bookings)
    );
}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    const bookings = getBookings();

    const total = bookings.length;

    const waiting = bookings.filter(
        booking =>
            booking.status === "Waiting"
    ).length;

    const completed = bookings.filter(
        booking =>
            booking.status === "Completed"
    ).length;

    const noShow = bookings.filter(
        booking =>
            booking.status === "No-Show"
    ).length;


    // TOTAL

    const totalElement =
        document.getElementById("totalBookings");

    if (totalElement) {
        totalElement.textContent = total;
    }


    // WAITING

    const waitingElement =
        document.getElementById("waitingTokens");

    if (waitingElement) {

        waitingElement.textContent =
            waiting.toString().padStart(2, "0");

    }


    // COMPLETED

    const completedElement =
        document.getElementById("completedTokens");

    if (completedElement) {

        completedElement.textContent =
            completed;

    }


    // NO-SHOW

    const noShowElement =
        document.getElementById("noShowTokens");

    if (noShowElement) {

        noShowElement.textContent =
            noShow;

    }


    // BOOKING COUNT

    const countElement =
        document.getElementById("bookingCount");

    if (countElement) {

        countElement.textContent =
            `${total} booking${total === 1 ? "" : "s"}`;

    }


    // TABLE

    displayBookings(bookings);
}


// ==========================================
// DISPLAY BOOKINGS
// ==========================================

function displayBookings(bookings) {

    const tableBody =
        document.getElementById(
            "bookingTableBody"
        );


    if (!tableBody) {
        return;
    }


    // NO BOOKINGS

    if (bookings.length === 0) {

        tableBody.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty">

                    No bookings yet

                </td>

            </tr>

        `;

        return;
    }


    tableBody.innerHTML = "";


    bookings.forEach(
        booking => {

            let statusClass =
                "waiting";


            if (
                booking.status === "Completed"
            ) {

                statusClass =
                    "completed";

            }


            if (
                booking.status === "No-Show"
            ) {

                statusClass =
                    "noshow";

            }


            const row =
                document.createElement("tr");


            row.innerHTML = `

                <td>

                    <strong class="token">

                        ${booking.ticketNumber || "-"}

                    </strong>

                </td>


                <td>

                    ${booking.userName || "-"}

                </td>


                <td>

                    ${booking.carNumber || "-"}

                </td>


                <td>

                    ${booking.bookingDate || "-"}

                </td>


                <td>

                    ${booking.bookingTime || "-"}

                </td>


                <td>

                    <span
                        class="status ${statusClass}">

                        ${booking.status || "Waiting"}

                    </span>

                </td>


                <td>

                    <div class="action-buttons">

                        ${
                            booking.status === "Waiting"

                            ?

                            `

                            <button
                                class="green-btn small-btn"
                                onclick="completeBooking('${booking.ticketNumber}')">

                                Complete

                            </button>


                            <button
                                class="red-btn small-btn"
                                onclick="markNoShow('${booking.ticketNumber}')">

                                No-Show

                            </button>

                            `

                            :

                            `

                            <button
                                class="dark-btn small-btn"
                                onclick="viewBooking('${booking.ticketNumber}')">

                                View

                            </button>

                            `
                        }

                    </div>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


// ==========================================
// COMPLETE BOOKING
// ==========================================

function completeBooking(ticketNumber) {

    const bookings =
        getBookings();


    const booking =
        bookings.find(
            item =>
                item.ticketNumber ===
                ticketNumber
        );


    if (!booking) {

        alert(
            "Booking not found."
        );

        return;
    }


    booking.status =
        "Completed";


    saveBookings(bookings);

    updateDashboard();


    alert(
        "Booking " +
        ticketNumber +
        " completed."
    );
}


// ==========================================
// MARK NO-SHOW
// ==========================================

function markNoShow(ticketNumber) {

    const bookings =
        getBookings();


    const booking =
        bookings.find(
            item =>
                item.ticketNumber ===
                ticketNumber
        );


    if (!booking) {

        alert(
            "Booking not found."
        );

        return;
    }


    booking.status =
        "No-Show";


    saveBookings(bookings);

    updateDashboard();


    alert(
        ticketNumber +
        " marked as No-Show."
    );
}


// ==========================================
// VIEW BOOKING
// ==========================================

function viewBooking(ticketNumber) {

    const bookings =
        getBookings();


    const booking =
        bookings.find(
            item =>
                item.ticketNumber ===
                ticketNumber
        );


    if (!booking) {

        alert(
            "Booking not found."
        );

        return;
    }


    alert(

        "INLINEASY BOOKING DETAILS\n\n" +

        "Ticket: " +
        booking.ticketNumber +

        "\nCustomer: " +
        booking.userName +

        "\nPhone: " +
        booking.phoneNumber +

        "\nCar Model: " +
        booking.carModel +

        "\nCar Number: " +
        booking.carNumber +

        "\nDate: " +
        booking.bookingDate +

        "\nShift: " +
        booking.bookingShift +

        "\nTime: " +
        booking.bookingTime +

        "\nBunk: " +
        booking.bunkName +

        "\nStatus: " +
        booking.status

    );
}


// ==========================================
// CALL NEXT TOKEN
// ==========================================

function nextToken() {

    const bookings =
        getBookings();


    const next =
        bookings.find(
            booking =>
                booking.status === "Waiting"
        );


    if (!next) {

        alert(
            "No waiting tokens."
        );

        return;
    }


    alert(

        "NEXT TOKEN\n\n" +

        "Token: " +
        next.ticketNumber +

        "\nCustomer: " +
        next.userName +

        "\nCar: " +
        next.carNumber +

        "\nTime: " +
        next.bookingTime

    );
}


// ==========================================
// VERIFY TICKET
// ==========================================

function verifyQR() {

    const ticket =
        prompt(
            "Enter Ticket Number:"
        );


    if (!ticket) {
        return;
    }


    const bookings =
        getBookings();


    const booking =
        bookings.find(
            item =>
                String(item.ticketNumber)
                    .toLowerCase() ===
                ticket.trim().toLowerCase()
        );


    if (!booking) {

        alert(
            "Ticket not found."
        );

        return;
    }


    alert(

        "BOOKING VERIFIED\n\n" +

        "Ticket: " +
        booking.ticketNumber +

        "\nCustomer: " +
        booking.userName +

        "\nCar: " +
        booking.carNumber +

        "\nDate: " +
        booking.bookingDate +

        "\nTime: " +
        booking.bookingTime +

        "\nStatus: " +
        booking.status

    );
}


// ==========================================
// STATION STATUS
// ==========================================

let stationOpen = true;


function toggleStation() {

    const status =
        document.getElementById(
            "stationStatus"
        );


    const button =
        document.getElementById(
            "stationButton"
        );


    stationOpen =
        !stationOpen;


    if (stationOpen) {

        status.textContent =
            "● Station Open";


        status.style.color =
            "#00FF42";


        button.textContent =
            "Close Station";


        button.className =
            "green-btn";


    } else {

        status.textContent =
            "● Station Closed";


        status.style.color =
            "#000000";


        button.textContent =
            "Open Station";


        button.className =
            "dark-btn";

    }
}


// ==========================================
// EMERGENCY MODE
// ==========================================

function emergencyMode() {

    const confirmEmergency =
        confirm(
            "Activate Emergency Mode?\n\n" +
            "The station will be closed."
        );


    if (!confirmEmergency) {
        return;
    }


    stationOpen =
        false;


    const status =
        document.getElementById(
            "stationStatus"
        );


    const button =
        document.getElementById(
            "stationButton"
        );


    if (status) {

        status.textContent =
            "Emergency Mode";

        status.style.color =
            "#000000";
    }


    if (button) {

        button.textContent =
            "Open Station";

        button.className =
            "dark-btn";
    }


    alert(
        "Emergency Mode Activated."
    );
}


// ==========================================
// REFRESH DASHBOARD
// ==========================================

function refreshDashboard() {

    updateDashboard();

}


// ==========================================
// CLEAR BOOKINGS
// ==========================================

function clearDemoData() {

    const confirmClear =
        confirm(
            "Delete ALL bookings?\n\n" +
            "This cannot be undone."
        );


    if (!confirmClear) {
        return;
    }


    localStorage.removeItem(
        "cngBookings"
    );


    updateDashboard();


    alert(
        "All bookings cleared."
    );
}


// ==========================================
// AUTO REFRESH
// ==========================================

function autoRefresh() {

    updateDashboard();

}


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "INLINEASY Admin Dashboard Loaded"
        );


        updateDashboard();

    }
);


// ==========================================
// UPDATE EVERY 5 SECONDS
// ==========================================

setInterval(
    autoRefresh,
    5000
);