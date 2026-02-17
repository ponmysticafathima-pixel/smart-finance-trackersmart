let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

function addTransaction() {
    let desc = document.getElementById("description").value;
    let amount = document.getElementById("amount").value;
    let type = document.getElementById("type").value;

    if (desc === "" || amount === "") {
        alert("Please fill all fields");
        return;
    }

    let transaction = {
        id: Date.now(),
        description: desc,
        amount: parseFloat(amount),
        type: type
    };

    transactions.push(transaction);
    localStorage.setItem("transactions", JSON.stringify(transactions));

    document.getElementById("description").value = "";
    document.getElementById("amount").value = "";

    renderTransactions();
    updateSummary();
    updateChart();
}

function renderTransactions() {
    let list = document.getElementById("transactionList");
    list.innerHTML = "";

    transactions.forEach(t => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${t.description} - ₹${t.amount}
            <button onclick="deleteTransaction(${t.id})">❌</button>
        `;
        list.appendChild(li);
    });
}

function deleteTransaction(id) {
    transactions = transactions.filter(t => t.id !== id);
    localStorage.setItem("transactions", JSON.stringify(transactions));
    renderTransactions();
    updateSummary();
    updateChart();
}

function updateSummary() {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });

    document.getElementById("totalIncome").innerText = "₹" + income;
    document.getElementById("totalExpense").innerText = "₹" + expense;
    document.getElementById("balance").innerText = "₹" + (income - expense);
}

let chart;

function updateChart() {
    let income = 0;
    let expense = 0;

    transactions.forEach(t => {
        if (t.type === "income") income += t.amount;
        else expense += t.amount;
    });

    if (chart) chart.destroy();

    chart = new Chart(document.getElementById("expenseChart"), {
        type: "doughnut",
        data: {
            labels: ["Income", "Expense"],
            datasets: [{
                data: [income, expense],
                backgroundColor: ["#16a34a", "#dc2626"]
            }]
        }
    });
}

renderTransactions();
updateSummary();
updateChart();
