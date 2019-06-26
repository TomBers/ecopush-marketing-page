var scrollToRevealArray = document.querySelectorAll(".scroll-to-reveal");
var ctaBtn = document.querySelector(".cta");
var mobileList = document.querySelector(".mobile-list");
var navIcon = document.querySelector(".nav--icon");
var btns = document.querySelectorAll(".js-btn");
var mobilebtns = document.querySelectorAll(".js-mobile-btn");
var sections = document.querySelectorAll(".js-section");
// var slider = tns({
//     container: ".slide__container",
//     arrowKeys: true,
//     controlsText: [
//         '<i class="fas fa-angle-left"></i>',
//         '<i class="fas fa-angle-right"></i>'
//     ],
//     nav: false
// });

//in page scrolling
function setActiveLink(event, buttons) {
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove("selected");
    }
    event.target.classList.add("selected");
}

function smoothScrollTo(i, buttons, event) {
    var element = sections[i - 1] || sections[i - 8];
    setActiveLink(event, buttons);

    if (mobileList.classList.contains("show")) {
        mobileList.classList.toggle("show");
    }

    window.scrollTo({
        behavior: "smooth",
        top: element.offsetTop - 100,
        left: 0
    });
}

for (var i = 0; i < scrollToRevealArray.length; i++) {
    var waypoint = new Waypoint({
        element: scrollToRevealArray[i],
        handler: function(direction) {
            this.element.classList.add("fadeInUp");
        },
        offset: Waypoint.viewportHeight()
    });
}

// new Waypoint({
//     element: ctaBtn,
//     handler: function(direction) {
//         if (direction === "down") {
//             document.querySelector("nav").classList.add("fixed");
//         } else {
//             document.querySelector("nav").classList.remove("fixed");
//         }
//     },
//     offset: -80
// });

if (btns.length && sections.length > 0) {
    for (var i = 0; i < btns.length; i++) {
        btns[i].addEventListener("click", smoothScrollTo.bind(this, i, btns));
    }
}

if (mobilebtns.length && sections.length > 0) {
    for (var i = 0; i < mobilebtns.length; i++) {
        mobilebtns[i].addEventListener(
            "click",
            smoothScrollTo.bind(this, i, mobilebtns)
        );
    }
}

navIcon.addEventListener("click", function() {
    document.getElementById('mobile-list').classList.toggle("show");
    document.querySelector(".mobile-list").classList.toggle("show");
});

function colLookup(indx) {
  switch (indx) {
    case 0: return 'rgba(25,197,135, 0.2)'

      break;
    case 1: return 'rgba(236,208,120, 0.2)'
      break;
      case 2: return 'rgba(173,10,82, 0.2)'
      break;
    default:
      return 'rgba(25,197,135, 0.2)'
      break;
  }
}

function draw_graph(sliderVals) {
  var emissions = [251,252,244,242,240,240,240,241,242,240,224,234,246,252,256,255,256,257,256,261,265,262,264,262,259,255,253,251,249,242,235,237,236,238,239,240,239,237,234,232,234,226,218,197,186,179,174,165];
  var price = [6.2, 6.2, 6.2, 6.2, 5.76, 5.76, 5.62, 5.62, 6.42, 6.5, 7.2, 6.88, 7.32, 7.34, 9.4, 9.4, 9.2, 9.22, 7.74, 7.74, 7.23, 7.24, 7.31, 7.31, 6.49, 6.48, 6.4, 6.4, 6.4, 6.4, 19.54, 21.14, 23.58, 23.58, 22.95, 23, 11.3, 11.3, 8.95, 8.83, 8.4, 8, 7.3, 7.1, 7, 7.09, 7.12, 6.9];


  var series = optimiseFor == 'price' ? price : emissions;

  var charge_data = _.map(sliderVals, function(indx) { return generate_charge_data(series, indx, indx+4); } )

  var total = calculateTotal(charge_data);

  document.getElementById("savings").innerHTML = total;
  var datasets = [{
    data: series,
    label: optimiseFor
  }
]
_.map(charge_data, function(data, indx) { datasets.push({data: data, label: 'Plug ' + (indx + 1), backgroundColor: colLookup(indx), pointRadius: 4, pointBackgroundColor: colLookup(indx), fill: true}) })

  drawLineGraph('myChart', dayLabels(), datasets);
}

function get_start_index(indx) {
  if (optimiseFor == 'price') {
    switch(indx) {
       case '1': return 3;
       case '2': return 14;
       case '3': return 31;
       default: return 20;
     }
  } else {
    switch(indx) {
       case '1': return 43;
       case '2': return 6;
       case '3': return 19;
       default: return 14;
     }
  }

}

function changeSlider() {
  var sliders = document.getElementsByClassName("plugSlider");
  draw_graph(_.map(sliders, function(slider){ return get_start_index(slider.value)}));
}

function changeSeries(new_series) {
  optimiseFor = new_series;
  changeSlider();
}

function calc_vals(data, bucket) {
  var bob = _.chunk(data,bucket);
  return _.map(bob, listSum);
}

function generate_charge_data(data, start_index, end_index) {
  return _.map(data, function(val, indx) { return indx >= start_index && indx <= end_index ? data[indx] : null })
}

function calculateTotal(data) {
  var power = 5.8;
  var tmp = _.map(data, function(val) { return listSum(val)})
  var total = Math.floor(listSum(tmp) * power)
  return optimiseFor == 'price' ? "Total price <strong>£" + total / 100 + "</strong> (per day)" : "Total emissions <strong>" + total / 1000 + "</strong> kgCO2 (per day)"
}

function listSum(list) {
  var r = _.reduce(list, function(memo, num){ return memo + num; }, 0);
  return r;
}
function drawLineGraph(divID, labels, datasets, legend) {
  var ctx = document.getElementById(divID).getContext('2d');
  var chart = new Chart(ctx, {
      type: 'line',
      data: {
          labels: labels,
          datasets: datasets
      },
      options: {
        scales: {
          yAxes: [{scaleLabel: {display: true, labelString: optimiseFor == 'price' ? "p / kWh" : "gCO2 / kWh"}}]
        }
      },
  });
}
    function dayLabels() {
  return [
        "00:00", "00:30",
        "01:00", "01:30",
        "02:00", "02:30",
        "03:00", "03:30",
        "04:00", "04:30",
        "05:00", "05:30",
        "06:00", "06:30",
        "07:00", "07:30",
        "08:00", "08:30",
        "09:00", "09:30",
        "10:00", "10:30",
        "11:00", "11:30",
        "12:00", "12:30",
        "13:00", "13:30",
        "14:00", "14:30",
        "15:00", "15:30",
        "16:00", "16:30",
        "17:00", "17:30",
        "18:00", "18:30",
        "19:00", "19:30",
        "20:00", "20:30",
        "21:00", "21:30",
        "22:00", "22:30",
        "23:00", "23:30",
      ];
}

function loadDevices(devices) {
  var container = document.getElementById("sliderContainer");
  _.map(devices, function(device) {

    var header = document.createElement("p");
    header.appendChild(document.createTextNode(device.name))
    container.appendChild(header);

    var slider = document.createElement("INPUT");
    slider.setAttribute("type", "range");
    slider.setAttribute("id", device.name);
    slider.setAttribute("min", "1");
    slider.setAttribute("max", "3");
    slider.setAttribute("value", device.initialValue);
    slider.setAttribute("class", "plugSlider")
    slider.setAttribute("onchange", "changeSlider()");

    container.appendChild(slider);

  })
  var label = document.createElement("p");
  label.setAttribute("class", "savingsLabel")
  label.appendChild(document.createTextNode("Max | Med | Min"))
  label.appendChild(document.createElement("br"))
  label.appendChild(document.createTextNode("(Savings)"))
  container.appendChild(label);

    draw_graph(_.map(devices, function(device){ return get_start_index(device.initialValue)}));
    var navIcon = document.querySelector(".nav--icon");
    navIcon.addEventListener("click", function() {
        document.querySelector(".mobile-list").classList.toggle("show");
    });
}
