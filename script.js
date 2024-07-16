const data = {
  customers: [
    { id: 1, name: "Ahmed Ali" },
    { id: 2, name: "Aya Elsayed" },
    { id: 3, name: "Mina Adel" },
    { id: 4, name: "Sarah Reda" },
    { id: 5, name: "Mohamed Sayed" },
  ],
  transactions: [
    { id: 1, customer_id: 1, date: "2022-01-01", amount: 1000 },
    { id: 2, customer_id: 1, date: "2022-01-02", amount: 2000 },
    { id: 3, customer_id: 2, date: "2022-01-01", amount: 550 },
    { id: 4, customer_id: 3, date: "2022-01-01", amount: 500 },
    { id: 5, customer_id: 2, date: "2022-01-02", amount: 1300 },
    { id: 6, customer_id: 4, date: "2022-01-01", amount: 750 },
    { id: 7, customer_id: 3, date: "2022-01-02", amount: 1250 },
    { id: 8, customer_id: 5, date: "2022-01-01", amount: 2500 },
    { id: 9, customer_id: 5, date: "2022-01-02", amount: 875 },
  ],
};

let filterNameInput = document.getElementById("filterName");
let filterAmountInput = document.getElementById("filterAmount");
let customerTableBody = document.querySelector("#customerTable tbody");
let chartElement = document.getElementById("chart");

function getCustomerName(customerId) {
  for (let i = 0; i < data.customers.length; i++) {
    if (data.customers[i].id === customerId) {
      return data.customers[i].name;
    }
  }
  return "Unknown";
}

function renderTable(customers, transactions) {
  customerTableBody.innerHTML = "";
  transactions.forEach((transaction) => {
    let customerName = getCustomerName(transaction.customer_id);
    let row = document.createElement("tr");
    row.innerHTML = `
            <td>${customerName}</td>
            <td>${transaction.date}</td>
            <td>${transaction.amount}</td>
        `;
    customerTableBody.appendChild(row);
  });
}

function filterTransactions() {
  let nameFilter = filterNameInput.value.toLowerCase();
  let amountFilter = parseInt(filterAmountInput.value, 10);

  let filteredTransactions = data.transactions.filter((transaction) => {
    let customerName = getCustomerName(transaction.customer_id).toLowerCase();
    let matchesName = customerName.includes(nameFilter);
    let matchesAmount =
      isNaN(amountFilter) || transaction.amount >= amountFilter;
    return matchesName && matchesAmount;
  });

  renderTable(data.customers, filteredTransactions);
  renderChart(filteredTransactions);
}

function renderChart(transactions) {
  let chartData = transactions.map((transaction) => {
    return {
      x: `${getCustomerName(transaction.customer_id)} (${transaction.date})`,
      y: transaction.amount,
    };
  });

  let options = {
    series: [
      {
        name: "Transactions",
        data: chartData,
      },
    ],
    chart: {
      type: "bar",
      height: 350,
    },
    xaxis: {
      type: "category",
      labels: {
        rotate: -45,
      },
    },
    title: {
      text: "Transaction Amounts",
      align: "left",
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    dataLabels: {
      enabled: false,
    },
  };

  if (chartElement.innerHTML !== "") {
    chartElement.innerHTML = "";
  }

  let chart = new ApexCharts(chartElement, options);
  chart.render();
}

renderTable(data.customers, data.transactions);
renderChart(data.transactions);

filterNameInput.addEventListener("input", filterTransactions);
filterAmountInput.addEventListener("input", filterTransactions);
