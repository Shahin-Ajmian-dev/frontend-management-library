const cookies = document.cookie.split(";")
const tokenCookie = cookies.find(function (cookie) {
    return cookie.startsWith("token=")
})
if (!tokenCookie) {
    window.location.href = "login.html"
}
const tokenValue = tokenCookie.split("=")[1]
const myLoans = "https://haditabatabaei.dev/api/loans/my-loans"

async function getItem() {
    const response = await fetch(myLoans, {
        headers: {
            Authorization: `Bearer ${tokenValue}`
        }

    })
    const data = await response.json()
    return data

}
let data
async function showLoans() {
    data = await getItem()
    let numberReturned = 0
    let numberActive = 0
    for (let i = 0; i < data.data.length; i++) {
        const numberLoans = document.getElementById("numberLoans")
        numberLoans.textContent = `${data.data.length}loans`
        const loanCard = document.createElement("tr")

        loanCard.innerHTML = `
                            <td>
                                <strong>${data.data[i].book.title}</strong>
                                <br>
                                <small style="color: #666;">${data.data[i].book.isbn}</small>
                            </td>
                            <td>${data.data[i].book.author}</td>
                            <td>${data.data[i].loanDate}</td>
                            <td><span class="status status-${data.data[i].status}">${data.data[i].status}</span></td>
                            <td>
                                <button class="btn btn-success btn-sm">Return</button>
                            </td>
                        `
        const bookLoan = document.getElementById("loansList")
        bookLoan.appendChild(loanCard)
        const btnReturn = loanCard.querySelector(".btn-success")
        const status = loanCard.querySelector(".status")


        btnReturn.addEventListener("click", async function () {
            const responseReturn = await fetch(`https://haditabatabaei.dev/api/loans/${data.data[i].id}/return`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${tokenValue}`
                }
            })
            const result = await responseReturn.json()

            if (result.success) {
                console.log(btnReturn)
                status.textContent = "returned"
                btnReturn.textContent = "returned"
                btnReturn.disabled = true
            }
        })
        if (data.data[i].status === "returned") {
            numberReturned++
        }
        if (data.data[i].status === "active") {
            numberActive++
        }
    }
    const activeLoans = document.getElementById("activeLoans")
    activeLoans.textContent = numberActive
    const returnBooks = document.getElementById("returnedBooks")
    returnBooks.textContent = numberReturned
}

showLoans()


