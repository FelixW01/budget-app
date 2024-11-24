let userDescription = document.getElementById('description');
let userValue = document.getElementById('value');
const titleEl = document.getElementById('modal-title');
let field = '';
const formModal = document.getElementById('form-container');

// Materialize logic for modal
document.addEventListener('DOMContentLoaded', function(event) {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
    addButtonListeners()
    updateInputValue()    
});

/* 
Add event listener on button to grab the attribute of the clicked button and render the title individually
This was done in order to dynamically render the title and get which button was clicked.  
*/
function addButtonListeners() {
  document.querySelectorAll('.modal-trigger').forEach(button => {
    button.addEventListener('click', function(event) {
    var clickedButton = event.target.getAttribute('data-button').trim();
    titleEl.textContent = clickedButton
    field = clickedButton;
    updateInputValue()
  });
});
}

// Renders $ at the start of value and only lets use to input numbers
function updateInputValue() {
  let inputValue = userValue.value;
  // Any character that's not a digit checked from the regex, replace it with an empty string
  let numericValue = inputValue.replace(/[^0-9]/g, '');

  if (numericValue === '') {
    userValue.value = '$';
  } else {
    userValue.value = `$${numericValue}`;
  }
}

/* 
Blueprint class that holds methods which will later be targeted in the budget class to make it dynamic.
This class also holds this.items array, this way it's not specific to either income or expenses.
I originally created everything under one budget class but this solution is more scallable and it follows the 4 foundations of OOP,
inheritance, encapsulation, polymorphism, abstraction
*/
class FieldItem {
  constructor() {
    this.items = [];
  }

  addItem(description, value) {
    const parsedValue = parseFloat(value.replace('$', '')) || 0;
    this.items.push({ description, value: parsedValue });
  }
  calculateTotal() {
    return this.items.reduce((sum, item) => sum + item.value, 0)
  }
   display(field) {
    console.log(`${field}:`, this.items);
  }
}


// Create an Income class with the blueprint of fieldItem via Super()
class Income extends FieldItem {
  constructor() {
    super()
  }
}

// Create an Expenses class with the blueprint of fieldItem via Super()
class Expenses extends FieldItem {
  constructor() {
    super()
  }
}

// This is where the dynamic logic was created
class Budget {
  constructor() {
    // Instantiate new income and expenses objects
    this.income = new Income();
    this.expenses = new Expenses();
  }
    // This method pretty much calls the addItem method from the parent class, but labels it with this.income and it's description, value resulting in a dynamic method.
    addIncome(description, value) {
    this.income.addItem(description, value)
    }
    // Same thing but with this.expenses instead
    addExpenses(description, value) {
    this.expenses.addItem(description, value)
    }
    calculateIncome() {
      return this.income.calculateTotal();
    }
    calculateExpenses() {
      return this.expenses.calculateTotal();
    }
    // Calculates the remaining budget of both income and expenses
    calculateRemainingBudget() {
    const totalIncome = this.income.calculateTotal();
    const totalExpenses = this.expenses.calculateTotal();
    return totalIncome - totalExpenses;
   }

   displayFields() {
    this.income.display('Income')
    this.expenses.display('Expenses')
    console.log('Remaining budget:', this.calculateRemainingBudget())
  }
}

  const myBudget = new Budget()
  let totalExpenses = myBudget.calculateExpenses()
  let totalIncome = myBudget.calculateIncome();
  let remainingBudget = myBudget.calculateRemainingBudget();
  const data = {
  labels: ['Income', 'Expenses', 'Remaining Budget'],
  datasets: [{
    label: 'Budget',
    data: [totalIncome, totalExpenses, remainingBudget],
    backgroundColor: [
      'rgb(76, 175, 80)',
      'rgb(239, 108, 108)',
      'rgb(66, 133, 244)'
    ],
    hoverOffset: 4
  }]
};

const options = {
  plugins: {
    tooltip: {
      callbacks: {
        label: function(context) {
          const value = context.raw;
          if (value < 0) {
            // if value is negative, rewrite the number to -$100 format, math.abs just turns number into positive
            return `-$${Math.abs(value).toString()}`;
          }
          // Adds a $ sign
          return `$${value.toString()}`;
        }
      }
    }
  },
  accessibility: {
    enabled: true
  }
};

// const formModal = document.getElementsByClassName('.modal')

  function handleSubmit(event) {
    event.preventDefault()
    const description = userDescription.value.trim();
    const value = userValue.value.trim();

    if (!description || !value || value === '$') {
    alert('Please enter valid description and value!');
    return;
    }

    if (field ==='Income') {
      myBudget.addIncome(description, value);
    } else if (field === "Expenses") {
      myBudget.addExpenses(description, value)
    }
    userDescription.value = '';
    userValue.value = '$';

    createCards(field)
    updateChart()

    // Get instance of Modal, if it already exists then close after submitting.
    const modalInstance = M.Modal.getInstance(document.getElementById('modal1'));
    if (modalInstance) {
    modalInstance.close();
  } else {
    console.error('Modal instance not found');
  }
  }

  function createCards(field) {
    const incomeDiv = document.getElementById('income-card-container');
    const expensesDiv = document.getElementById('expense-card-container');
    const incomeItems = myBudget.income.items
    const expenseItems = myBudget.expenses.items
  

    if (field === 'Income') {
      incomeDiv.innerHTML = '';
      incomeItems.forEach((income) => {
      incomeDiv.innerHTML += 
        `<div class="income-card-div">
         <p>${income.description}</p> <p>$${income.value}</p>
         </div>`
    });
    } else if (field === 'Expenses'){
      expensesDiv.innerHTML = '';
      expenseItems.forEach((expense) => {
      expensesDiv.innerHTML += 
        `<div class="expense-card-div">
         <p>${expense.description}</p> <p>$${expense.value}</p>
         </div>`
    });
    }
  }

  function updateChart() {
  const totalIncome = myBudget.calculateIncome();
  const totalExpenses = myBudget.calculateExpenses();
  const remainingBudget = myBudget.calculateRemainingBudget();
  let chartDataset = budgetChart.data.datasets[0]

  chartDataset.data = [totalIncome, totalExpenses, remainingBudget];
  chartDataset.backgroundColor[2] = remainingBudget < 0 ? 'rgb(255, 69, 58)' : 'rgb(66, 133, 244)';
  budgetChart.update();
}

  // Chart.js logic
  const ctx = document.getElementById('myChart');

  let budgetChart = new Chart(ctx, {
    type: 'doughnut',
    data: data,
    options: options
  });
