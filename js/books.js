const cookies = document.cookie.split(";")
const tokenCookie = cookies.find(function (cookie) {
    return cookie.trim().startsWith("token=")
})

if (!tokenCookie) {
    window.location.href = "login.html"
}
const tokenValue = tokenCookie.trim().split("=")[1]
async function getUserId() {
    const responseUser = await fetch("https://haditabatabaei.dev/api/auth/me", {
        headers: {
            Authorization: `Bearer ${tokenValue}`
        }
    })
    const dataUSer = await responseUser.json()
    return dataUSer.data.user.id

}

const response = "https://haditabatabaei.dev/api/books"

const cacheKey = "booksCache"
const cacheTimeKey = "booksCacheTime"
const cacheDuration = 5 * 60 * 1000



let data
async function showCart() {
    const cachedBooks = localStorage.getItem(cacheKey)
    const savedTime = localStorage.getItem(cacheTimeKey)

    if (cachedBooks && savedTime && Date.now() - Number(savedTime) < cacheDuration) {
        data = JSON.parse(cachedBooks)
    }
    if (!data) {
        const responsone = await fetch(response, {
            headers: {
                Authorization: `Bearer ${tokenValue}`
            }
        })
        data = await responsone.json()
        const booksData = JSON.stringify(data)
        localStorage.setItem(cacheKey, booksData)
        localStorage.setItem(cacheTimeKey, Date.now().toString())


    }
    const userId = await getUserId()
    for (let i = 0; i < data.data.length; i++) {
        const bookCard = document.createElement("div")

        bookCard.innerHTML = `<div class="card">
                    <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                        <h3 style="margin: 0; color: #2c3e50;" id="bookTitle">JavaScript: ${data.data[i].title}</h3>
                        <span class="status status-available" id="bookAvailable">${data.data[i].status}</span>
                    </div>
                    <p style="color: #666; margin-bottom: 0.5rem;" id="bookAuthor"><strong>Author:</strong> ${data.data[i].author}</p>
                    <p style="color: #666; margin-bottom: 0.5rem;" id="bookIsbn"><strong>ISBN:</strong>${data.data[i].isbn}</p>
                    <p style="color: #666; margin-bottom: 0.5rem;" id="bookCategory"><strong>Category:</strong> ${data.data[i].category.name}</p>
                    <p style="color: #666; margin-bottom: 1rem;" id="bookAvailableCopies"><strong>Available Copies:</strong> ${data.data[i].availableCopies}</p>
                    <p style="margin-bottom: 1rem; font-size: 0.9rem; color: #555;" id="description">${data.data[i].description}</p>
                    <div style="display: flex; gap: 0.5rem;">
                        <button class="btn btn-primary btn-sm">Borrow Book</button>
                        <button class="btn btn-secondary btn-sm">View Details</button>
                    </div>
                </div>`

        const bookStatus = bookCard.querySelector(".status")
        const btnBorrow = bookCard.querySelector(".btn-primary")
        if (data.data[i].availableCopies === 0) {
            bookStatus.textContent = "Unavailable"
            bookStatus.style.backgroundColor = "#f8d7da"
            btnBorrow.disabled = true

        } else {
            bookStatus.textContent = "Available"
            btnBorrow.addEventListener("click", async function () {
                const responseTwo = await fetch("https://haditabatabaei.dev/api/loans", {

                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${tokenValue}`
                    },
                    body: JSON.stringify({
                        userId: userId,
                        bookId: data.data[i].id
                    })
                })
                const result1 = await responseTwo.json()
                btnBorrow.disabled = true
                btnBorrow.textContent = "Borrowed"

                localStorage.removeItem(cacheKey)
                localStorage.removeItem(cacheTimeKey)

                const message = document.createElement("p")
                message.textContent = result1.message
                message.style.color = "green"

                bookCard.appendChild(message)
            })



        }

        booksGrid.appendChild(bookCard)


    }
}
showCart()









