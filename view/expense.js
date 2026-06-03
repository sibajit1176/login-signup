const params = new URLSearchParams(window.location.search);
const userId = params.get('userId');
console.log(userId);

const getData = async (userId) => {
    try {
        const edata = await axios.get(`http://localhost:5000/expense/getExpense/${userId}`)
        const expenseslist = edata.data.reslt
        console.log(expenseslist);

        const expList = document.querySelector("#expenseList")
        expList.innerHTML = ""
        expenseslist.forEach(element => {
            expList.innerHTML += `
         <div class="expense-card">

            <div class="expense-details">
                <p><strong>Amount:</strong> ${element.spentMoney}</p>
                <p><strong>Description:</strong> ${element.desc ?? ''}</p>
                <p><strong>Category:</strong>${element.category}</p>
            </div>

            <div class="expense-actions">
                <button class="edit-btn" data-id="${element.id}">Edit</button>
                <button class="delete-btn" data-id="${element.id}">Delete</button>
            </div>

        </div>
        `
        });

    } catch (error) {
        console.log(error);

    }
}
window.addEventListener('load', (e) => {
    getData(userId)
})

const form = document.querySelector('form')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const price = document.querySelector('#money').value
    const desc = document.querySelector('#desc').value
    const category = document.querySelector('#category').value
    const payload = {
        userId: userId,
        spentMoney: price,
        desc: desc,
        category: category
    }
    addData(payload)
})

const addData = async (payload) => {
    try {
        const res = await axios.post("http://localhost:5000/expense/addExpense", payload)
        console.log(res);

        alert(res.data.message)
        getData(userId)
        document.querySelector('#money').value = ""
        document.querySelector('#desc').value = ""
        document.querySelector('#category').value = ""
    } catch (error) {
        console.log(error);

    }
}