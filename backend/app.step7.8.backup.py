from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import random

# ==========================================
# INLINEASY BACKEND
# ==========================================

app = Flask(__name__)
CORS(app)

DATABASE = "inlineasy.db"


# ==========================================
# DATABASE CONNECTION
# ==========================================

def get_db():

    conn = sqlite3.connect(DATABASE)

    conn.row_factory = sqlite3.Row

    return conn


# ==========================================
# CREATE DATABASE TABLES
# ==========================================

def init_db():

    conn = get_db()

    cursor = conn.cursor()

    # USERS TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            name TEXT NOT NULL,

            mobile TEXT UNIQUE NOT NULL

        )
    """)

    # BOOKINGS TABLE
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS bookings (

            id INTEGER PRIMARY KEY AUTOINCREMENT,

            user_id INTEGER NOT NULL,

            bunk TEXT NOT NULL,

            booking_date TEXT NOT NULL,

            booking_time TEXT NOT NULL,

            car_name TEXT NOT NULL,

            car_number TEXT NOT NULL,

            token TEXT UNIQUE NOT NULL,

            status TEXT DEFAULT 'BOOKED',

            FOREIGN KEY (user_id)
                REFERENCES users(id)

        )
    """)

    conn.commit()

    conn.close()


# ==========================================
# HOME / SERVER TEST
# ==========================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({

        "message":
            "INLINEASY Backend Running",

        "status":
            "success"

    })


# ==========================================
# CREATE BOOKING
# ==========================================

@app.route("/api/bookings", methods=["POST"])
def create_booking():

    data = request.get_json()

    if not data:

        return jsonify({

            "success": False,

            "message":
                "No JSON data received"

        }), 400


    # ======================================
    # GET DATA
    # ======================================

    name = data.get("name")

    mobile = data.get("mobile")

    bunk = data.get("bunk")

    booking_date = data.get("date")

    booking_time = data.get("time")

    car_name = data.get("car_name")

    car_number = data.get("car_number")


    # ======================================
    # CHECK REQUIRED DATA
    # ======================================

    if not all([

        name,
        mobile,
        bunk,
        booking_date,
        booking_time,
        car_name,
        car_number

    ]):

        return jsonify({

            "success": False,

            "message":
                "All fields are required"

        }), 400


    conn = get_db()

    cursor = conn.cursor()


    try:

        # ==================================
        # FIND USER
        # ==================================

        cursor.execute(
            """
            SELECT id
            FROM users
            WHERE mobile = ?
            """,
            (mobile,)
        )

        user = cursor.fetchone()


        # ==================================
        # EXISTING USER
        # ==================================

        if user:

            user_id = user["id"]

            cursor.execute(
                """
                UPDATE users
                SET name = ?
                WHERE id = ?
                """,
                (
                    name,
                    user_id
                )
            )


        # ==================================
        # NEW USER
        # ==================================

        else:

            cursor.execute(
                """
                INSERT INTO users
                (
                    name,
                    mobile
                )
                VALUES (?, ?)
                """,
                (
                    name,
                    mobile
                )
            )

            user_id = cursor.lastrowid


        # ==================================
        # CHECK SAME SLOT
        # ==================================

        cursor.execute(
            """
            SELECT id
            FROM bookings
            WHERE bunk = ?
            AND booking_date = ?
            AND booking_time = ?
            AND status != 'CANCELLED'
            """,
            (
                bunk,
                booking_date,
                booking_time
            )
        )

        existing_booking = cursor.fetchone()


        if existing_booking:

            conn.close()

            return jsonify({

                "success": False,

                "message":
                    "This slot is already booked"

            }), 409


        # ==================================
        # GENERATE TOKEN
        # ==================================

        while True:

            token = (
                "CNG"
                +
                str(
                    random.randint(
                        100,
                        999
                    )
                )
            )

            cursor.execute(
                """
                SELECT id
                FROM bookings
                WHERE token = ?
                """,
                (token,)
            )

            token_exists = cursor.fetchone()


            if not token_exists:

                break


        # ==================================
        # SAVE BOOKING
        # ==================================

        cursor.execute(
            """
            INSERT INTO bookings
            (
                user_id,
                bunk,
                booking_date,
                booking_time,
                car_name,
                car_number,
                token,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """,
            (
                user_id,
                bunk,
                booking_date,
                booking_time,
                car_name,
                car_number,
                token,
                "BOOKED"
            )
        )


        booking_id = cursor.lastrowid


        conn.commit()


        # ==================================
        # RESPONSE
        # ==================================

        return jsonify({

            "success": True,

            "message":
                "Booking created successfully",

            "booking": {

                "id":
                    booking_id,

                "name":
                    name,

                "mobile":
                    mobile,

                "bunk":
                    bunk,

                "date":
                    booking_date,

                "time":
                    booking_time,

                "car_name":
                    car_name,

                "car_number":
                    car_number,

                "token":
                    token,

                "status":
                    "BOOKED"

            }

        })


    except Exception as error:

        conn.rollback()

        return jsonify({

            "success": False,

            "message":
                str(error)

        }), 500


    finally:

        conn.close()


# ==========================================
# GET USER BOOKINGS
# ==========================================

@app.route(
    "/api/bookings/<mobile>",
    methods=["GET"]
)
def get_bookings(mobile):

    conn = get_db()

    cursor = conn.cursor()


    cursor.execute(
        """
        SELECT

            users.name,

            users.mobile,

            bookings.id,

            bookings.bunk,

            bookings.booking_date,

            bookings.booking_time,

            bookings.car_name,

            bookings.car_number,

            bookings.token,

            bookings.status

        FROM users

        JOIN bookings

        ON users.id = bookings.user_id

        WHERE users.mobile = ?

        ORDER BY bookings.id DESC
        """,
        (mobile,)
    )


    bookings = cursor.fetchall()

    conn.close()


    result = []


    for booking in bookings:

        result.append(
            dict(booking)
        )


    return jsonify({

        "success":
            True,

        "bookings":
            result

    })


# ==========================================
# GET ALL BOOKINGS
# ADMIN DASHBOARD
# ==========================================

@app.route(
    "/api/bookings/all",
    methods=["GET"]
)
def get_all_bookings():

    conn = get_db()

    cursor = conn.cursor()


    cursor.execute(
        """
        SELECT

            bookings.id,

            users.name,

            users.mobile,

            bookings.bunk,

            bookings.booking_date,

            bookings.booking_time,

            bookings.car_name,

            bookings.car_number,

            bookings.token,

            bookings.status

        FROM bookings

        JOIN users

        ON bookings.user_id = users.id

        ORDER BY bookings.id DESC
        """
    )


    bookings = cursor.fetchall()

    conn.close()


    result = []


    for booking in bookings:

        result.append(
            dict(booking)
        )


    return jsonify({

        "success":
            True,

        "bookings":
            result,

        "count":
            len(result)

    })


# ==========================================
# UPDATE BOOKING STATUS
# ==========================================

@app.route(
    "/api/bookings/<int:booking_id>/status",
    methods=["PUT"]
)
def update_booking_status(
    booking_id
):

    data = request.get_json()


    if not data:

        return jsonify({

            "success": False,

            "message":
                "No data received"

        }), 400


    status = data.get("status")


    allowed_statuses = [

        "BOOKED",

        "WAITING",

        "COMPLETED",

        "NO-SHOW",

        "CANCELLED"

    ]


    if status not in allowed_statuses:

        return jsonify({

            "success": False,

            "message":
                "Invalid status"

        }), 400


    conn = get_db()

    cursor = conn.cursor()


    cursor.execute(
        """
        UPDATE bookings

        SET status = ?

        WHERE id = ?
        """,
        (
            status,
            booking_id
        )
    )


    if cursor.rowcount == 0:

        conn.close()

        return jsonify({

            "success": False,

            "message":
                "Booking not found"

        }), 404


    conn.commit()

    conn.close()


    return jsonify({

        "success":
            True,

        "message":
            "Booking status updated",

        "booking_id":
            booking_id,

        "status":
            status

    })


# ==========================================
# GET SINGLE BOOKING
# ==========================================

@app.route(
    "/api/booking/<token>",
    methods=["GET"]
)
def get_booking_by_token(token):

    conn = get_db()

    cursor = conn.cursor()


    cursor.execute(
        """
        SELECT

            bookings.id,

            users.name,

            users.mobile,

            bookings.bunk,

            bookings.booking_date,

            bookings.booking_time,

            bookings.car_name,

            bookings.car_number,

            bookings.token,

            bookings.status

        FROM bookings

        JOIN users

        ON bookings.user_id = users.id

        WHERE bookings.token = ?

        """,
        (token,)
    )


    booking = cursor.fetchone()

    conn.close()


    if not booking:

        return jsonify({

            "success": False,

            "message":
                "Booking not found"

        }), 404


    return jsonify({

        "success":
            True,

        "booking":
            dict(booking)

    })


# ==========================================
# SERVER START
# ==========================================

if __name__ == "__main__":

    init_db()


    print(
        "==================================="
    )

    print(
        "       INLINEASY BACKEND"
    )

    print(
        "==================================="
    )

    print(
        "Server: http://127.0.0.1:5000"
    )

    print(
        "Database: inlineasy.db"
    )

    print(
        "==================================="
    )


    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )
