// ==========================================
// INLINEASY - LOGIN
// ==========================================

function continueToBunk() {

    const userName =
        document.getElementById("userName").value.trim();

    const phoneNumber =
        document.getElementById("phoneNumber").value.trim();

    const errorMessage =
        document.getElementById("errorMessage");


    // Clear previous error

    errorMessage.textContent = "";
    errorMessage.style.display = "none";


    // ==========================================
    // USERNAME VALIDATION
    // ==========================================

    if (userName === "") {

        errorMessage.textContent =
            "Please enter your username.";

        errorMessage.style.display =
            "block";

        return;
    }


    // ==========================================
    // PHONE VALIDATION
    // ==========================================

    if (!/^[6-9][0-9]{9}$/.test(phoneNumber)) {

        errorMessage.textContent =
            "Please enter a valid 10-digit phone number.";

        errorMessage.style.display =
            "block";

        return;
    }


    // ==========================================
    // SAVE USER DATA
    // ==========================================

    localStorage.setItem(
        "userName",
        userName
    );

    localStorage.setItem(
        "phoneNumber",
        phoneNumber
    );


    // ==========================================
    // NEXT PAGE
    // ==========================================

    window.location.href =
        "bunktwo.html";
}