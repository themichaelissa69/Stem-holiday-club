
const SUPABASE_URL = "https://bekciedrzdiidlvtcbsm.supabase.co";
const SUPABASE_KEY = "sb_publishable_YDGFGQvnJpt9xhQIe-nxkw_XTq4Sq0R";

const db = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);

// ================================
// ADMIN AUTHENTICATION
// ================================

document.addEventListener("DOMContentLoaded", async () => {

    const loginScreen = document.getElementById("loginScreen");
    const mainApp = document.getElementById("mainApp");
    const loginForm = document.getElementById("loginForm");
    const loginMessage = document.getElementById("loginMessage");

    console.log("Login system starting...");
    console.log("loginScreen:", loginScreen);
    console.log("mainApp:", mainApp);
    console.log("loginForm:", loginForm);
    console.log("loginMessage:", loginMessage);

    if (!loginScreen || !mainApp || !loginForm || !loginMessage) {
        console.error("LOGIN ERROR: One or more login elements are missing.");
        return;
    }


// Check existing Supabase session
try {

        const {
            data: { session },
            error
        } = await db.auth.getSession();

        if (error) {
            console.error("Session error:", error);
            showLogin();
            return;
        }

        console.log("Current session:", session);

        if (session) {
    console.log("Existing session found.");
}

showLogin();

    } catch (error) {

        console.error("Authentication startup error:", error);
        showLogin();

    }


    // LOGIN
    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        console.log("Login button pressed.");

        const emailInput =
            document.getElementById("adminEmail");

        const passwordInput =
            document.getElementById("adminPassword");

        const email =
            emailInput.value.trim();

        const password =
            passwordInput.value;

        if (!email || !password) {

            loginMessage.textContent =
                "Please enter your email and password.";

            return;
        }

        loginMessage.textContent =
            "Logging in...";

        console.log("Attempting login for:", email);

        try {

            const {
                data,
                error
            } = await db.auth.signInWithPassword({

                email: email,
                password: password

            });

            console.log("Login response:", data);
            console.log("Login error:", error);

            if (error) {

                loginMessage.textContent =
                    error.message;

                console.error(
                    "SUPABASE LOGIN ERROR:",
                    error
                );

                return;
            }

            if (!data.session) {

                loginMessage.textContent =
                    "Login succeeded, but no session was created.";

                console.error(
                    "No Supabase session returned."
                );

                return;
            }

            loginMessage.textContent =
                "Login successful!";

            console.log(
                "Login successful. Showing application..."
            );

            showApp();

        } catch (error) {

            console.error(
                "Unexpected login error:",
                error
            );

            loginMessage.textContent =
                "An unexpected error occurred.";

        }

    });


    function showApp() {

        console.log("showApp() called.");

        loginScreen.style.display = "none";
        mainApp.style.display = "block";

        console.log(
            "loginScreen display:",
            loginScreen.style.display
        );

        console.log(
            "mainApp display:",
            mainApp.style.display
        );
    }


    function showLogin() {

        console.log("showLogin() called.");

        loginScreen.style.display = "flex";
        mainApp.style.display = "none";

    }

});
/* ==========================================
   STEM HOLIDAY CLUB
   EQUIPMENT REGISTRATION SYSTEM
========================================== */


const activities = [
    "multimedia",
    "robotics",
    "entrepreneurship",
    "chess",
    "hackathon"
];


const activityNames = {

    multimedia: "MULTIMEDIA",

    robotics: "ROBOTICS",

    entrepreneurship: "ENTREPRENEURSHIP",

    chess: "CHESS",

    hackathon: "HACKATHON"

};

let editingId = null;


/* ==========================================
   STORAGE
========================================== */

async function getRecords(activity) {

    const { data, error } = await db
        .from("equipment_registrations")
        .select("*")
        .eq("activity", activity)
        .order("id", { ascending: true });

    if (error) {

        console.error(
            "Error loading records:",
            error
        );

        return [];

    }

    return data || [];
}





/* ==========================================
   PAGE NAVIGATION
========================================== */

function openPage(page, button) {

    document
        .querySelectorAll(".page")
        .forEach(function (section) {

            section.classList.remove("active");

        });


    document
        .getElementById(page)
        .classList.add("active");


    document
        .querySelectorAll(".nav-button")
        .forEach(function (item) {

            item.classList.remove("active");

        });


    button.classList.add("active");


    document
        .getElementById("sidebar")
        .classList.remove("open");


    if (page !== "dashboard") {

        buildActivityPage(page);

    }


    updateDashboard();
}


/* ==========================================
   MOBILE MENU
========================================== */

function toggleMenu() {

    document
        .getElementById("sidebar")
        .classList.toggle("open");

}


/* ==========================================
   CURRENT DATE
========================================== */

function getToday() {

    const date = new Date();

    return date
        .toISOString()
        .split("T")[0];

}


/* ==========================================
   CURRENT TIME
========================================== */

function getCurrentTime() {

    const date = new Date();

    const hours =
        String(date.getHours())
        .padStart(2, "0");

    const minutes =
        String(date.getMinutes())
        .padStart(2, "0");

    return hours + ":" + minutes;

}


/* ==========================================
   BUILD ACTIVITY PAGE
========================================== */

function buildActivityPage(activity) {

    const container =
        document.getElementById(
            activity + "Content"
        );


    container.innerHTML = `

        <div class="registration-card">

            <form
                id="form-${activity}"
                onsubmit="
                    saveRegistration(
                        event,
                        '${activity}'
                    )
                "
            >

                <div class="form-grid">

                    <div class="field">

                        <label>DATE</label>

                        <input
                            type="date"
                            id="date-${activity}"
                            value="${getToday()}"
                            required
                        >

                    </div>


                    <div class="field">

                        <label>NAME</label>

                        <input
                            type="text"
                            id="name-${activity}"
                            placeholder="Participant name"
                            required
                        >

                    </div>


                    <div class="field">

                        <label>ITEMS</label>

                        <input
                            type="text"
                            id="items-${activity}"
                            placeholder="Equipment / items"
                            required
                        >

                    </div>


                    <div class="field">

                        <label>SIGN IN TIME</label>

                        <input
                            type="time"
                            id="signin-${activity}"
                            value="${getCurrentTime()}"
                            required
                        >

                    </div>

                </div>


                <div class="form-buttons">

                    <button
                        class="gold-button"
                        id="save-${activity}"
                        type="submit"
                    >
                        SIGN IN
                    </button>


                    <button
                        class="clear-button"
                        type="button"
                        onclick="
                            resetForm('${activity}')
                        "
                    >
                        CLEAR
                    </button>

                </div>

            </form>

        </div>


        <input
            class="search"
            id="search-${activity}"
            type="text"
            placeholder="Search name, date or equipment..."
            oninput="
                displayTable('${activity}')
            "
        >


        <div class="table-container">

            <table>

                <thead>

                    <tr>

                        <th>#</th>

                        <th>DATE</th>

                        <th>NAME</th>

                        <th>ITEMS</th>

                        <th>SIGN IN TIME</th>

                        <th>SIGN OUT TIME</th>

                        <th>STATUS</th>

                        <th>ACTIONS</th>

                    </tr>

                </thead>


                <tbody
                    id="table-${activity}"
                >

                </tbody>

            </table>

        </div>

    `;


    displayTable(activity);

}


/* ==========================================
   SAVE REGISTRATION
========================================== */

async function saveRegistration(event, activity) {

    event.preventDefault();

    const date =
        document.getElementById(
            "date-" + activity
        ).value;

    const name =
        document.getElementById(
            "name-" + activity
        ).value.trim();

    const items =
        document.getElementById(
            "items-" + activity
        ).value.trim();

    const signin =
        document.getElementById(
            "signin-" + activity
        ).value;


    /* =========================
       EDIT EXISTING REGISTRATION
    ========================= */

    if (editingId !== null) {

        const { error } = await db
            .from("equipment_registrations")
            .update({
                date: date,
                name: name,
                items: items,
                signin: signin
            })
            .eq("id", editingId);

        if (error) {

            console.error(
                "Error updating registration:",
                error
            );

            showNotification(
                "Error updating registration"
            );

            return;
        }

        showNotification(
            "Registration updated"
        );

    }


    /* =========================
       NEW REGISTRATION
    ========================= */

    else {

        const newRecord = {

            id: Date.now(),

            activity: activity,

            date: date,

            name: name,

            items: items,

            signin: signin,

            signout: null

        };


        const { error } = await db
            .from("equipment_registrations")
            .insert(newRecord);

        if (error) {

            console.error(
                "Error saving registration:",
                error
            );

            showNotification(
                "Error saving registration"
            );

            return;
        }

        showNotification(
            "Person signed in successfully"
        );
    }


    editingId = null;

    resetForm(activity);

    await displayTable(activity);

    await updateDashboard();
}


/* ==========================================
   SIGN OUT
========================================== */

async function signOut(activity, id) {

    const { error } = await db
        .from("equipment_registrations")
        .update({
            signout: getCurrentTime()
        })
        .eq("id", id)
        .eq("activity", activity);

    if (error) {

        console.error(
            "Error recording sign-out:",
            error
        );

        showNotification(
            "Error recording sign-out"
        );

        return;
    }
    

    showNotification(
        "Sign-out time recorded"
    );
}


/* ==========================================
   EDIT
========================================== */

async function editRegistration(
    activity,
    id
) {

    const { data: records, error } = await db
        .from("equipment_registrations")
        .select("*")
        .eq("id", id)
        .eq("activity", activity)
        .limit(1);

    if (error) {

        console.error(
            "Error loading registration:",
            error
        );

        showNotification(
            "Error loading registration"
        );

        return;
    }

    const record = records && records[0];

    if (!record) {

        showNotification(
            "Registration not found"
        );

        return;
    }

    editingId = id;

    document.getElementById(
        "date-" + activity
    ).value = record.date;

    document.getElementById(
        "name-" + activity
    ).value = record.name;

    document.getElementById(
        "items-" + activity
    ).value = record.items;

    document.getElementById(
        "signin-" + activity
    ).value = record.signin;

    document.getElementById(
        "save-" + activity
    ).textContent =
        "UPDATE REGISTRATION";

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}


/* ==========================================
   DELETE
========================================== */

function showDeleteConfirmation() {
    return new Promise((resolve) => {

        const modal =
            document.getElementById("deleteModal");

        const cancelButton =
            document.getElementById("cancelDelete");

        const confirmButton =
            document.getElementById("confirmDelete");

        modal.style.display = "flex";

        cancelButton.onclick = () => {
            modal.style.display = "none";
            resolve(false);
        };

        confirmButton.onclick = () => {
            modal.style.display = "none";
            resolve(true);
        };
    });
}
async function deleteRegistration(
    activity,
    id
) {

    const confirmDelete = await showDeleteConfirmation();

if (!confirmDelete) {
    return;
}

    const { error } = await db
        .from("equipment_registrations")
        .delete()
        .eq("id", id)
        .eq("activity", activity);

    if (error) {

        console.error(
            "Error deleting registration:",
            error
        );

        showNotification(
            "Error deleting registration"
        );

        return;
    }

    await displayTable(activity);

    await updateDashboard();

    showNotification(
        "Registration deleted"
    );
}


/* ==========================================
   RESET FORM
========================================== */

function resetForm(activity) {

    editingId = null;


    const form =
        document.getElementById(
            "form-" + activity
        );


    if (!form) {

        return;

    }


    form.reset();


    document.getElementById(
        "date-" + activity
    ).value =
        getToday();


    document.getElementById(
        "signin-" + activity
    ).value =
        getCurrentTime();


    document.getElementById(
        "save-" + activity
    ).textContent =
        "SIGN IN";

}


/* ==========================================
   DISPLAY TABLE
========================================== */

async function displayTable(activity) {
    const table =
        document.getElementById(
            "table-" + activity
        );


    if (!table) {

        return;

    }


    const searchInput =
        document.getElementById(
            "search-" + activity
        );


    const search =
        searchInput
            ? searchInput.value.toLowerCase()
            : "";


    let records =
    await getRecords(activity);


    records =
        records.filter(
            function (item) {

                return (

                    item.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    item.items
                        .toLowerCase()
                        .includes(search)

                    ||

                    item.date
                        .includes(search)

                );

            }
        );


    table.innerHTML = "";


    if (records.length === 0) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="8"
                    style="
                        text-align:center;
                        padding:25px;
                        color:#777;
                    "
                >

                    No registrations found.

                </td>

            </tr>

        `;

        return;

    }


    records.forEach(
        function (record, index) {

            const row =
                document.createElement("tr");


            const status =
                record.signout

                    ?

                    `
                    <span class="status status-out">
                        COMPLETED
                    </span>
                    `

                    :

                    `
                    <span class="status status-in">
                        SIGNED IN
                    </span>
                    `;


            const signout =
                record.signout

                    ?

                    record.signout

                    :

                    `

                    <button
                        class="action-button signout-button"
                        onclick="
                            signOut(
                                '${activity}',
                                ${record.id}
                            )
                        "
                    >
                        SIGN OUT
                    </button>

                    `;


            row.innerHTML = `

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${record.date}
                </td>

                <td>
                    <strong>
                        ${escapeHTML(record.name)}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(record.items)}
                </td>

                <td>
                    ${record.signin}
                </td>

                <td>
                    ${signout}
                </td>

                <td>
                    ${status}
                </td>

                <td>

                    <button
                        class="action-button edit-button"
                        onclick="
                            editRegistration(
                                '${activity}',
                                ${record.id}
                            )
                        "
                    >
                        EDIT
                    </button>


                    <button
                        class="action-button delete-button"
                        onclick="
                            deleteRegistration(
                                '${activity}',
                                ${record.id}
                            )
                        "
                    >
                        DELETE
                    </button>

                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* ==========================================
   DASHBOARD
========================================== */

async function updateDashboard() {

    let total = 0;
    let signedIn = 0;
    let completed = 0;

    const activityCounts = {};

    for (const activity of activities) {

        const records = await getRecords(activity);

        activityCounts[activity] = records.length;

        total += records.length;

        records.forEach(function (record) {

            if (record.signout) {
                completed++;
            } else {
                signedIn++;
            }

        });
    }

    document.getElementById(
        "totalRegistrations"
    ).textContent = total;

    document.getElementById(
        "currentlySignedIn"
    ).textContent = signedIn;

    document.getElementById(
        "completedRegistrations"
    ).textContent = completed;

    const summary =
        document.getElementById("activitySummary");

    summary.innerHTML = "";

    for (const activity of activities) {

        const count = activityCounts[activity];

        summary.innerHTML += `
            <div class="activity-row">

                <strong>
                    ${activityNames[activity]}
                </strong>

                <span>
                    ${count} registrations
                </span>

                <button
                    onclick="
                        goToActivity('${activity}')
                    "
                >
                    OPEN
                </button>

            </div>
        `;
    }
}


/* ==========================================
   OPEN ACTIVITY FROM DASHBOARD
========================================== */

function goToActivity(activity) {

    const buttons =
        document.querySelectorAll(
            ".nav-button"
        );


    let selectedButton = null;


    buttons.forEach(
        function (button) {

            if (
                button
                    .getAttribute("onclick")
                    .includes(
                        "'" + activity + "'"
                    )
            ) {

                selectedButton = button;

            }

        }
    );


    openPage(
        activity,
        selectedButton
    );

}


/* ==========================================
   SECURITY AGAINST HTML INJECTION
========================================== */

function escapeHTML(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* ==========================================
   NOTIFICATION
========================================== */

function showNotification(message) {

    const notification =
        document.getElementById(
            "notification"
        );


    notification.textContent =
        message;


    notification.style.display =
        "block";


    setTimeout(
        function () {

            notification.style.display =
                "none";

        },
        2500
    );

}


/* ==========================================
   START APPLICATION
========================================== */

window.addEventListener(
    "load",
    function () {

        activities.forEach(
            function (activity) {

                buildActivityPage(activity);

            }
        );


        updateDashboard();

    }
);
   async function migrateLocalStorageToSupabase() {

    const activitiesToMigrate = [
        "multimedia",
        "robotics",
        "entrepreneurship",
        "chess",
        "hackathon"
    ];

    let totalMigrated = 0;

    for (const activity of activitiesToMigrate) {

        const saved =
            localStorage.getItem(
                "stem_" + activity
            );

        if (!saved) {
            continue;
        }

        let records;

        try {

            records = JSON.parse(saved);

        } catch (error) {

            console.error(
                "Could not read " + activity,
                error
            );

            continue;
        }

        if (!Array.isArray(records) || records.length === 0) {
            continue;
        }

        const supabaseRecords =
            records.map(function (record) {

                return {

                    id: record.id,

                    activity: activity,

                    date: record.date,

                    name: record.name,

                    items: record.items,

                    signin: record.signin,

                    signout: record.signout || null

                };

            });


        const { error } = await db
            .from("equipment_registrations")
            .upsert(
                supabaseRecords,
                {
                    onConflict: "id"
                }
            );


        if (error) {

            console.error(
                "Migration error for " + activity + ":",
                error
            );

            continue;
        }


        totalMigrated +=
            supabaseRecords.length;

        console.log(
            activity +
            ": " +
            supabaseRecords.length +
            " records migrated."
        );
    }


    console.log(
        "MIGRATION COMPLETE: " +
        totalMigrated +
        " records migrated."
    );

    alert(
        "Migration complete. " +
        totalMigrated +
        " records copied to Supabase."
    );

   }
window.logout = async function () {
    try {
        const { error } = await db.auth.signOut({
            scope: "local"
        });

        if (error) {
            console.error("Logout error:", error);
            return;
        }

        const loginScreen = document.getElementById("loginScreen");
        const mainApp = document.getElementById("mainApp");

        if (mainApp) {
            mainApp.style.display = "none";
        }

        if (loginScreen) {
            loginScreen.style.display = "flex";
        }

        document.getElementById("adminEmail").value = "";
        document.getElementById("adminPassword").value = "";

        console.log("Logout successful.");

    } catch (error) {
        console.error("Logout error:", error);
    }
};
