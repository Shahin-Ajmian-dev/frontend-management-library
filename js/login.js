const cookies = document.cookie.split(";")

const tokenCookie = cookies.find(function (cookie) {
    return cookie.trim().startsWith("token=")
})
if (tokenCookie) {
    window.location.href = "dashboard.html"
}

const loginForm = document.getElementById("loginForm")
const email = document.getElementById("email")
const password = document.getElementById("password")

email.addEventListener("input", function () {
    validateEmail()
})
password.addEventListener("input", function () {
    validatePassword()
})

const response = "https://haditabatabaei.dev/api/auth/login"
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault()
    const isEmailName = validateEmail()

    const isPasswordValid = validatePassword()

    if (!isEmailName || !isPasswordValid) {
        return;
    }
    try {
        const responseLogin= await fetch(response, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })
        const data = await responseLogin.json()
        if (!responseLogin.ok) {
            setError("password", "ایمیل یا رمز عبور اشتباه است")
            return false
        }
        document.cookie = `token=${data.token};path=/`
        window.location.href = "dashboard.html"
    } catch (error) {
        setError("password", "ارتباط با سرور برقرار نشد")
    }
})

function setError(name, message) {
    const errorElem = document.getElementById(`${name}-error`)

    errorElem.textContent = message
}
function clearError(name) {
    const errorElem = document.getElementById(`${name}-error`)
    errorElem.textContent = ""
}


function validateEmail() {
    const value = email.value
    if (value === "") {
        setError("email", "ایمیل وارد نشده")
        return false
    }
    let numberatsim = 0
    for (let i = 0; i < value.length; i++) {
        if (value[i] === " ") {
            setError("email", "ایمیل نباید شامل فاصله باشد")
        }
        if (value[i] === "@") {
            numberatsim++
        }
        if (numberatsim > 1) {
            setError("email", "ایمیل بیشتر از@دارد")
            return false
        }

    }

    clearError("email")
    return true
}

function validatePassword() {
    const value = password.value
    if (value === "") {
        setError("password", "پسورد وارد نشد")
        return false
    }
    if (value.length < 8) {
        setError("password", "رمز عبور نباید کمتر از 8 کارکتر باشد")
        return false
    }
    // let hasUpper = false
    let hasLower = false
    for (let i = 0; i < value.length; i++) {
        // if(value[i] >= "A" && value[i] <= "Z"){
        //     hasUpper = true
        // }
        if (value[i] >= "a" && value[i] <= "z") {
            hasLower = true
        }
        if (value[i] === "\t" || value[i] === " ") {
            setError("password", "رمز عبور نباید شامل فاصله یا Tabباشد")
            return false
        }
    }
    // if(!hasUpper){
    //     setError("password","رمز عبور باید حداقل یک حرف بزرگ انگلیسی داشته باشد")
    //     return false
    // }
    if (!hasLower) {
        setError("password", "رمز عبور باید حداقل یک حرف کوچک انگلیسی داشته باشد")
        return false;
    }
    clearError("password")
    return true
}