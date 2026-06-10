const params = new URLSearchParams(window.location.search);
axios.interceptors.response.use(
    (response) => response,

    (error) => {

        if (
            error.response &&
            error.response.status === 401
        ) {

            localStorage.removeItem(
                'userdetails'
            );

            alert(
                'Session expired. Please login again.'
            );

            window.location.href =
                'signup.html';
        }

        return Promise.reject(
            error
        );
    }
);

const getData = async () => {
    try {
        const token = localStorage.getItem('userdetails')
        const edata = await axios.get(`http://localhost:5000/expense/getExpense`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        const expenseslist = edata.data.reslt
        const userDetails = edata.data.findUser;

        const premiumBtn =
            document.querySelector('#premiumBtn');

        const premiumFeatures =
            document.querySelector('#premiumFeatures');

        if (userDetails.isPrime) {

            premiumBtn.style.display = 'none';

            premiumFeatures.style.display = 'block';
            getLeaderBoardData()

        } else {

            premiumBtn.style.display = 'block';

            premiumFeatures.style.display = 'none';
        }
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
    const token = localStorage.getItem('userdetails')

    if (!token) {
        document.body.style.display = 'none';
        window.location.href = `signup.html`;
        return
    }
    const payload = JSON.parse(
        atob(token.split('.')[1])
    );

    console.log(payload, "=============");
    const profileBtn =
        document.querySelector('#profileBtn');

    const profileModal =
        document.querySelector('#profileModal');

    const closeModal =
        document.querySelector('#closeModal');

    profileBtn.addEventListener('click', () => {
        profileModal.style.display = 'flex';
    });

    closeModal.addEventListener('click', () => {
        profileModal.style.display = 'none';
    });
    profileBtn.addEventListener('click', () => {

        const token =
            localStorage.getItem('userdetails');

        const payload = JSON.parse(
            atob(token.split('.')[1])
        );

        profileModal.style.display = 'block';

        document.querySelector('#modalName')
            .textContent = payload.username;

        document.querySelector('#modalEmail')
            .textContent = payload.useremail;
    });
    window.addEventListener('click', (e) => {
        if (e.target === profileModal) {

            profileModal.style.display = 'none';
        }
    });
    getData()
    verifypayment()
})

const form = document.querySelector('form')

form.addEventListener('submit', (e) => {
    e.preventDefault()
    const price = document.querySelector('#money').value
    const desc = document.querySelector('#desc').value
    const category = document.querySelector('#category').value
    const payload = {
        spentMoney: price,
        desc: desc,
        category: category
    }
    addData(payload)
})

const addData = async (payload) => {
    try {
        const token = localStorage.getItem('userdetails')
        const res = await axios.post("http://localhost:5000/expense/addExpense",
            payload,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        console.log(res);

        alert(res.data.message)
        getData()
        document.querySelector('#money').value = ""
        document.querySelector('#desc').value = ""
        document.querySelector('#category').value = ""
    } catch (error) {
        console.log(error);

    }
}
const premiumBtn = document.querySelector('#premiumBtn')

premiumBtn.addEventListener('click', (e) => {
    premimumApicall()

})
const premimumApicall = async () => {
    try {
        const token = localStorage.getItem('userdetails')
        const res = await axios.post("http://localhost:5000/payment/create-order", {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }

        )
        const sessionId = res.data.sessionId
        const orderId = res.data.orderId
        localStorage.setItem(
            'pendingOrderId',
            orderId
        );
        const cashfree = Cashfree({
            mode: "sandbox"
        })
        cashfree.checkout({
            paymentSessionId: sessionId,
            redirectTarget: "_self"
        })
    } catch (error) {
        console.log(error);

    }
}
const verifypayment = async () => {
    try {
        const orderId =
            localStorage.getItem('pendingOrderId');

        if (!orderId) {
            return
        };
        const token =
            localStorage.getItem('userdetails');

        const res = await axios.get(
            `http://localhost:5000/payment/verify/${orderId}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${token}`
                }
            }
        );

        console.log(res.data);

        if (res.data.orderStatus === 'SUCCESS') {
            alert('Premium Activated Successfully');
            window.history.replaceState(
                {},
                document.title,
                window.location.pathname
            );
            getData()
        }
        localStorage.removeItem(
            'pendingOrderId'
        );

    } catch (error) {
        console.log(error);
    }
}

const getLeaderBoardData = async () => {
    try {
        const res = await axios.get(
            'http://localhost:5000/premimum/leaderBoard'
        );

        const data = res.data.getDatafromExpense;
        const tableBody =
            document.querySelector(
                '#leaderBoardBody'
            );

        tableBody.innerHTML = '';

        data.forEach((item, index) => {


            tableBody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${item.userEntity.userName}</td>
                    <td>₹${item.totalExpense}</td>
                </tr>
            `;
        });

    } catch (error) {
        console.log(error);
    }
};

const aiinput = document.querySelector('#askAiBtn')
aiinput.addEventListener('click', (e) => {
    const inputval = document.querySelector('#aiQuestion').value
    geminiCall(inputval)
})


const geminiCall = async (query) => {
    try {
        const getres = await axios.post('http://localhost:5000/premimum/geminiresponse', { query })
        console.log(getres);
        const divtag = document.querySelector('#aiResponse')
        divtag.innerHTML = `<p>${getres.data.answer}</p>`


    } catch (error) {
        console.log(error);

    }
}

const logoutbtn = document.querySelector('#logoutBtn')
logoutbtn.addEventListener('click', (e) => {
    localStorage.removeItem('userdetails')
    document.body.style.display = 'none';
    window.location.href = `signup.html`;
})
const deleteExpense = async (id) => {
    try {

        const token =
            localStorage.getItem('userdetails');

        const res = await axios.delete(
            `http://localhost:5000/expense/deleteExpense?eId=${id}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        alert(res.data.message);

        getData();

    } catch (error) {
        console.log(error);
    }
};
const expenseList = document.querySelector('#expenseList');

expenseList.addEventListener('click', (e) => {

    if (e.target.classList.contains('delete-btn')) {

        const id = e.target.dataset.id;

        console.log(id);

        deleteExpense(id);
    }

});