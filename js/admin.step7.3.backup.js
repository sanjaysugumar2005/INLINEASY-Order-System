// ==========================================
// INLINEASY - ADMIN DASHBOARD
// STEP 7.3 - DATABASE BOOKINGS
// ==========================================

const API_URL = "http://127.0.0.1:5000";

let bookings = [];


// ==========================================
// LOAD BOOKINGS FROM DATABASE
// ==========================================

async function loadBookings() {

    try {

        const response = await fetch(
            `${API_URL}/api/bookings/all`
        );

        if (!response.ok) {

            throw new Error(
                `Server error: ${response.status}`
            );

        }

        const data = await response.json();

        if (!data.success) {

            throw new Error(
                data.message || "Unable to load bookings"
            );

        }

        bookings = data.bookings || [];

        updateDashboard();

        console.log(
            "INLINEASY bookings:",
            bookings
        );

    } catch (error) {

        console.error(
            "Failed to load bookings:",
            error
        );

        const tableBody =
            document.getElementById(
                "bookingTableBody"
            );

        if (tableBody) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="100%" style="text-align:center;">
                        Unable to connect to INLINEASY server
                    </td>
                </tr>
            `;

        }

    }
}


// ==========================================
// UPDATE DASHBOARD
// ==========================================

function updateDashboard() {

    const total =
        bookings.length;


    const waiting =
        bookings.filter(
            booking =>
                booking.status === "WAITING" ||
                booking.status === "Waiting" ||
                booking.status === "BOOKED"
        ).length;


    const completed =
        bookings.filter(
            booking =>
                booking.status === "COMPLETED" ||
                booking.status === "Completed"
        ).length;


    const noShow =
        bookings.filter(
            booking =>
                booking.status === "NO-SHOW" ||
                booking.status === "No-Show"
        ).length;


    // TOTAL

    const totalElement =
        document.getElementById(
            "totalBookings"
        );

    if (totalElement) {

        totalElement.textContent =
            total;

    }


    // WAITING

    const waitingElement =
        document.getElementById(
            "waitingTokens"
        );

    if (waitingElement) {

        waitingElement.textContent =
            String(waiting).padStart(2, "0");

    }


    // COMPLETED

    const completedElement =
        document.getElementById(
            "completedTokens"
        );

    if (completedElement) {

        completedElement.textContent =
            completed;

    }


    // NO SHOW

    const noShowElement =
        document.getElementById(
            "noShowTokens"
        );

    if (noShowElement) {

        noShowElement.textContent =
            noShow;

    }


    // BOOKING COUNT

    const countElement =
        document.getElementById(
            "bookingCount"
        );

    if (countElement) {

        countElement.textContent =
            `${total} booking${total === 1 ? "" : "s"}`;

    }


    displayBookings();

}


// ==========================================
// DISPLAY BOOKINGS
// ==========================================

function displayBookings() {

    const tableBody =
        document.getElementById(
            "bookingTableBody"
        );


    if (!tableBody) {

        console.warn(
            "bookingTableBody not found"
        );

        return;

    }


    tableBody.innerHTML = "";


    if (bookings.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="100%" style="text-align:center;">
                    No bookings yet
                </td>
            </tr>
        `;

        return;

    }


    bookings.forEach(
        booking => {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${booking.token || "-"}
                </td>

                <td>
                    ${booking.name || "-"}
                </td>

                <td>
                    ${booking.mobile || "-"}
                </td>

                <td>
                    ${booking.car_name || "-"}
                </td>

                <td>
                    ${booking.car_number || "-"}
                </td>

                <td>
                    ${booking.booking_date || "-"}
                </td>

                <td>
                    ${booking.booking_time || "-"}
                </td>

                <td>
                    ${booking.bunk || "-"}
                </td>

                <td>
                    <span class="status">
                        ${booking.status || "BOOKED"}
                    </span>
                </td>

                <td>

                    <button
                        type="button"
                        onclick="completeBooking(${booking.id})">
                        Complete
                    </button>

                    <button
                        type="button"
                        onclick="markNoShow(${booking.id})">
                        No-Show
                    </button>

                </td>

            `;


            tableBody.appendChild(row);

        }
    );

}


// ==========================================
// UPDATE BOOKING STATUS
// ==========================================

async function updateBookingStatus(
    bookingId,
    status
) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/bookings/${bookingId}/status`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok || !data.success) {

            throw new Error(
                data.message ||
                "Status update failed"
            );

        }


        await loadBookings();


    } catch (error) {

        console.error(
            "Status update error:",
            error
        );

        alert(
            "Unable to update booking."
        );

    }

}


// ==========================================
// COMPLETE BOOKING
// ==========================================

function completeBooking(
    bookingId
) {

    updateBookingStatus(
        bookingId,
        "COMPLETED"
    );

}


// ==========================================
// MARK NO-SHOW
// ==========================================

function markNoShow(
    bookingId
) {

    updateBookingStatus(
        bookingId,
        "NO-SHOW"
    );

}


// ==========================================
// VIEW BOOKING
// ==========================================

function viewBooking(
    bookingId
) {

    const booking =
        bookings.find(
            item =>
                item.id == bookingId
        );


    if (!booking) {

        alert(
            "Booking not found."
        );

        return;

    }


    alert(

        "INLINEASY BOOKING\n\n" +

        "Token: " +
        booking.token +

        "\nName: " +
        booking.name +

        "\nMobile: " +
        booking.mobile +

        "\nCar: " +
        booking.car_name +

        "\nCar Number: " +
        booking.car_number +

        "\nDate: " +
        booking.booking_date +

        "\nTime: " +
        booking.booking_time +

        "\nBunk: " +
        booking.bunk +

        "\nStatus: " +
        booking.status

    );

}


// ==========================================
// REFRESH DASHBOARD
// ==========================================

function refreshDashboard() {

    loadBookings();

}


// ==========================================
// AUTO REFRESH
// ==========================================

setInterval(
    loadBookings,
    10000
);


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadBookings();

    }
);
