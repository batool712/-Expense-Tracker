// DOM element
const expenseslist = document.getElementById("expenses-list");
const expenseForm = document.getElementById("expense-form");
const expenseName = document.getElementById("expense-name");
const expenseDate = document.getElementById("expense-date");
const expenseAmount = document.getElementById("expense-amount");
const expenseDescription = document.getElementById("expense-description");


const BASE_API_URL = "https://pennypath-server.vercel.app/api/v1/expenses";

let currentPage = 1;
const itemsPerPage = 6;


async function fetchAndDisplayExpenses(page = 1) {
  try {
    const response = await fetch(`${BASE_API_URL}?limit=${itemsPerPage}&page=${page}`);
    
    if (!response.ok) throw new Error("Failed to fetch expenses from server.");

    const jsonData = await response.json();
    const expenses = jsonData.data.expenses; 
    const totalPages = jsonData.data.totalPages;


    if (expenses.length === 0) {
      expenseslist.innerHTML = "<p>No expenses found.</p>";
      return;
    }

    expenseslist.innerHTML = "";

    expenses.forEach(expense => {
      const card = document.createElement("div");
      card.className = "expense-card";

      card.innerHTML = `
        <h3>${expense.name}</h3>
        <p class="expense-amount">$${expense.amount.toFixed(2)}</p>
        <p>${new Date(expense.date).toLocaleDateString()}</p>
        <p>${expense.description || "-"}</p>
        <div class="expense-actions">
          <button class="icon-btn btn-edit" onclick="editExpense('${expense.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <button class="icon-btn btn-delete" onclick="deleteExpense('${expense.id}')">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;

      expenseslist.appendChild(card);
    });


    document.getElementById("prev-btn").disabled = page <= 1;
    document.getElementById("next-btn").disabled = page >= totalPages;

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
}
document.getElementById("next-btn").addEventListener("click", () => {
  currentPage++;
  fetchAndDisplayExpenses(currentPage);
});

document.getElementById("prev-btn").addEventListener("click", () => {
  if (currentPage > 1) currentPage--;
  fetchAndDisplayExpenses(currentPage);
});


// add new expense

expenseForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const newExpense = {
    name: expenseName.value,
    date: expenseDate.value,
    amount: parseFloat(expenseAmount.value),
    description: expenseDescription.value
  };

  try {
    const res = await fetch(BASE_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newExpense)
    });

    if (!res.ok) throw new Error("Failed to add expense");

    const data = await res.json();
    alert("Expense added successfully");

    expenseForm.reset();


    fetchAndDisplayExpenses(currentPage);

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
});


fetchAndDisplayExpenses(currentPage);
