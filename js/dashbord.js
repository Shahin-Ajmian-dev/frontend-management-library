
const cookies = document.cookie.split(";")
const tokenCookie = cookies.find(function (cookie) {
    return cookie.startsWith("token=")
})
if (!tokenCookie) {
    window.location.href = "login.html"
}
const tokenValue = tokenCookie.split("=")[1]
const response = "https://haditabatabaei.dev/api/auth/me"
async function getUser() {
    const responseDashbord= await fetch(response, {
        headers: {
            Authorization: `Bearer ${tokenValue}`
        }
    })
    const data = await responseDashbord.json()
    const userName = document.getElementById("userName")
    userName.textContent = data.data.user.firstName
    const activeLoans = document.getElementById("activeLoans")
    activeLoans.textContent = data.data.stats.activeLoans
    const availableBooks = document.getElementById("availableBooks")
    availableBooks.textContent = data.data.stats.availableBooks
}
getUser()

const logout = document.getElementById("logout")

logout.addEventListener("click", function (event) {
    event.preventDefault()

    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/"

    window.location.href = "login.html"
})