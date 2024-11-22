let userDescription = document.getElementById('description');
let userValue = document.getElementById('value');
const titleEl = document.getElementById('modal-title');

document.addEventListener('DOMContentLoaded', function(event) {
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
    addButtonListeners()
    updateInputValue()
    
});

function addButtonListeners() {
  document.querySelectorAll('.modal-trigger').forEach(button => {
    button.addEventListener('click', function(event) {
    const clickedButton = event.target.getAttribute('data-button');
    updateInputValue(clickedButton)
  });
});
}

  // Renders $ at the start of value and only lets use to input numbers
function updateInputValue(clickedButton) {
  let inputValue = userValue.value;
  // Any character that's not a digit checked from the regex, replace it with an empty string
  let numericValue = inputValue.replace(/[^0-9]/g, '');

  titleEl.textContent = clickedButton

  if (numericValue === '') {
    userValue.value = '$';
  } else {
    userValue.value = `$${numericValue}`;
  }
}

  function handleSubmit() {
    console.log(userDescription.value.trim(), '<<< desc')
    console.log(userValue.value.trim(), '<<< value')
  }

  // Chart.js logic
  const ctx = document.getElementById('myChart');

  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      datasets: [{
        label: '# of Votes',
        data: [12, 19, 3, 5, 2, 3],
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });