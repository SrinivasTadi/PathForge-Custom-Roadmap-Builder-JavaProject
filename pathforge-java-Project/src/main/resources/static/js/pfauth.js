// SIGN UP FUNCTION

async function signup() {

    const username =
        document.getElementById("username").value;

    const email =
        document.getElementById("email").value;

    const password =
        document.getElementById("password").value;

    // PASSWORD VALIDATION


const specialCharRegex =
    /[!@#$%^&*(),.?":{}|<>]/;

const numberRegex =
    /[0-9]/;

if(password.length < 8){
    alert(
        "Password must contain at least 8 characters"
    );
    return;
}

if(!specialCharRegex.test(password)){
    alert(
        "Password must contain at least one special character"
    );
    return;
}

if(!numberRegex.test(password)){
    alert(
        "Password must contain at least one number"
    );
    return;
}

    const user = {
        username,
        email,
        password
    };

    const response = await fetch(
        "/auth/signup",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)
        }
    );

    const message = await response.text();

    alert(message);

    if(message === "User Registered Successfully"){
        window.location.href = "pflogin.html";
    }
}


// LOGIN FUNCTION
async function login() {

    const email =
        document.getElementById("loginEmail").value;

    const password =
        document.getElementById("loginPassword").value;

    const user = {
        email,
        password
    };

    const response = await fetch(
        "/auth/login",
        {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(user)
        }
    );

    const message = await response.text();

    alert(message);

    if(message === "Login Successful"){

        // Store logged-in user email

        localStorage.setItem(
            "loggedInUser",
            email
        );

        // Redirect to dashboard

        window.location.href = "pfdashboard.html";
    }
}