const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spin-btn");
const finalValue = document.getElementById("final-value");
const pyroBefore = document.querySelector(".pyro > .before");
const pyroAfter = document.querySelector(".pyro > .after");

// Mapping of values to their respective degrees
const valueToDegreeMap = {
  1: 70,
  2: 360,
  3: 310,
  4: 250,
  5: 190,
  6: 130,
};

const data = [16, 16, 16, 16, 16, 16];
const pieColors = ["#6A46B0", "#4C3083", "#6A46B0", "#4C3083", "#6A46B0", "#4C3083"];

let myChart = new Chart(wheel, {
  plugins: [ChartDataLabels],
  type: "pie",
  data: {
    labels: [100, 250, 500, 1250, 2500, 10000],
    datasets: [{ backgroundColor: pieColors, data: data }],
  },
  options: {
    responsive: true,
    animation: { duration: 0 },
    plugins: {
      tooltip: false,
      legend: { display: false },
      datalabels: {
        color: "#ffffff",
        formatter: (_, context) => context.chart.data.labels[context.dataIndex],
        font: { size: 24 },
      },
    },
  },
});

// Placeholder for backend input
let backendValue = 6; // This should be set based on backend input

function getDegreeByValue(value) {
  return valueToDegreeMap[value];
}

function updatePyroVisibility(value) {
  if (value === 6) {
    pyroBefore.style.display = "block";
    pyroAfter.style.display = "block";
  } else {
    pyroBefore.style.display = "none";
    pyroAfter.style.display = "none";
  }
}

spinBtn.addEventListener("click", () => {
  if (backendValue >= 1 && backendValue <= 6) {
    spinBtn.disabled = true;
    finalValue.innerHTML = `<p>Good Luck!</p>`;
    let degree = getDegreeByValue(backendValue);
    console.log(`Value: ${backendValue}, Degree: ${degree}`);

    let count = 0;
    let resultValue = 101;
    let rotationInterval = window.setInterval(() => {
      myChart.options.rotation += resultValue;
      myChart.update();
      if (myChart.options.rotation >= 360) {
        myChart.options.rotation -= 360;
        count++;
        resultValue -= 5;
      } else if (count > 15 && Math.abs(myChart.options.rotation - degree) < resultValue) {
        finalValue.innerHTML = `<p>Value: ${backendValue}</p>`;
        // Update the visibility of pyro elements here after stopping the spin
        updatePyroVisibility(backendValue);
        clearInterval(rotationInterval);
        spinBtn.disabled = false;
        count = 0;
        resultValue = 101;
      }
    }, 10);
  } else {
    console.error("Invalid backend value. Please ensure it is between 1 and 6.");
  }
});
