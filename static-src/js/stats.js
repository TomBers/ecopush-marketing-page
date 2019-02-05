function getWeeksArray() {
    var weekArray = [];
    for (var i = 0; i < 30; i++) {
        weekArray.push("3/" + i);
    }
    return weekArray;
}

function getGeneratedLineData(numbers) {
    return {
        labels: getWeeksArray(),
        datasets: [
            {
                borderColor: "rgba(25, 197, 135, .6)",
                pointColor: "#19c587",
                data: numbers,
                pointRadius: 4,
                borderWidth: 1,
                pointBackgroundColor: "#19c587"
            }
        ]
    };
}

function getGeneratedBarData(numbers) {
    var labels = getWeeksArray();
    return {
        labels: getWeeksArray(),
        datasets: [
            {
                labels: labels,
                backgroundColor: "rgba(25, 197, 135, .6)",
                data: numbers
            }
        ]
    };
}

function randomArray(length, max) {
    return Array.apply(null, Array(length)).map(function() {
        return Math.round(Math.random() * max);
    });
}

function drawChart(element, max) {
  var ctx = element.getContext("2d");
  var type, dataType;

  if (i !== 1 && i !== 4) {
      type = "line";
      dataType = getGeneratedLineData(randomArray(50, max));
  } else {
      type = "bar";
      dataType = getGeneratedBarData(randomArray(50, max));
  }

  new Chart(ctx, {
      type: type,
      data: dataType,
      scaleShowVerticalLines: false,
      scaleGridLineColor: "black",
      options: {
          responsive: true,
          maintainAspectRatio: false,
          elements: {
              line: {
                  tension: 0
              }
          },
          legend: {
              display: false
          },
          scales: {
              yAxes: [
                  {
                      ticks: {
                          fontColor: "#444363",
                          fontSize: 12
                      }
                  }
              ],
              xAxes: [
                  {
                      ticks: {
                          fontColor: "#444363",
                          fontSize: 12
                      }
                  }
              ]
          }
      }
  });
}


document.addEventListener("DOMContentLoaded", function(event) {
    drawChart(document.getElementById("stats-0"), 500);
    drawChart(document.getElementById("stats-1"), 1500);
    drawChart(document.getElementById("stats-2"), 200);
});
