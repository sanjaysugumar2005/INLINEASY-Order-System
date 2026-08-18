// ======================================
// GENERATE 15-MINUTE SLOTS
// ======================================

function generateSlots(shift) {

    const slotsContainer =
        document.getElementById(
            "slots"
        );


    if (!slotsContainer) {
        return;
    }


    // Clear old slots

    slotsContainer.innerHTML =
        "";


    // ==================================
    // SHIFT TIME
    // ==================================

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


    // ==================================
    // SELECTED DATE
    // ==================================

    const selectedDate =
        dateInput
            ? dateInput.value
            : "";


    const isToday =
        selectedDate === todayString;


    // ==================================
    // CURRENT TIME
    // ==================================

    const currentTime =
        new Date();


    const currentMinutes =
        currentTime.getHours() * 60 +
        currentTime.getMinutes();


    // ==================================
    // CREATE 15-MINUTE SLOTS
    // ==================================

    for (
        let hour = startHour;
        hour < endHour;
        hour++
    ) {

        for (
            let minute = 0;
            minute < 60;
            minute += 15
        ) {

            // ==================================
            // FORMAT SLOT TIME
            // ==================================

            const time =
                formatTime(
                    hour,
                    minute
                );


            // ==================================
            // CREATE BUTTON
            // ==================================

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


            // ==================================
            // SLOT START TIME
            // ==================================

            const slotStartMinutes =
                hour * 60 +
                minute;


            // ==================================
            // CHECK PAST TIME
            // ==================================

            const isPast =
                isToday &&
                slotStartMinutes <=
                currentMinutes;


            // ==================================
            // BOOKED OR PAST
            // ==================================

            if (
                isBooked ||
                isPast
            ) {

                slot.classList.add(
                    "booked"
                );


                slot.disabled =
                    true;


                // Already booked

                if (isBooked) {

                    slot.textContent =
                        `🔴 ${time}`;

                    slot.title =
                        "Already booked";

                }

                // Time already passed

                else {

                    slot.textContent =
                        `⚫ ${time}`;

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


            // ==================================
            // ADD SLOT TO PAGE
            // ==================================

            slotsContainer.appendChild(
                slot
            );

        }

    }

}
