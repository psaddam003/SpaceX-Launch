let filterObject = {
  year: null, launch: null, landing: null
}

function yearButton() {
  var div = document.getElementById('launchYear');
  for (let i = 2006; i <= 2020; i++) {
    var btn = document.createElement('button');
    var txt = document.createTextNode(String(i));

    btn.appendChild(txt);
    btn.setAttribute('type', 'button');
    btn.setAttribute('name', 'year');
    btn.setAttribute('class', 'year-button');
    btn.setAttribute('id', 'year_' + i);
    div.appendChild(btn);

    $("#year_" + i).click(function (event) {
      const name = event.target.name;
      var yearText = $(this).text();
      filterObject[name] = yearText;
      getJsonData();
    })
  }
}

function launchGen(json) {
  var html = "";
  json.forEach(function (val) {
    var num = val.flight_number;
    var payload = val.rocket.second_stage.payloads;
    var patchSrc = val.links.mission_patch;

    if (patchSrc !== null && patchSrc.indexOf("imgur") > -1) {
      patchSrc = patchSrc.replace("i.imgur.com/", "kageurufu.net/imgur/?");
    }
    var launchDate = new Date(val.launch_date_unix * 1000);

    html += "<div data-launch='" + num + "' class='launch card'>";
    html += "<div class='card-header'>";

    if (patchSrc !== null) {
      html += "<img class='launch-patch img-fluid' src='" + patchSrc + "' />";
    }
    html += "</div>";
    html += "<div class='card-block'>";
    for (i = 0; i < payload.length; i++) {
      html += "<p><strong>Mission ID:</strong> " + payload[i].payload_id + " &nbsp;#" + val.flight_number + "</p>";



    }

    html +=
      "<p class='date'><strong>Launch Date:</strong> " +
      launchDate.toLocaleDateString() +
      "</p>";
    html +=
      "<p><strong>Rocket Name:</strong> " + val.rocket.rocket_name + "</p>";
    html +=
      "<p><strong>Rocket Type:</strong> " + val.rocket.rocket_type + "</p>";
    if (val.launch_success === true) {
      html +=
        "<p class='launch-success'><strong>Launch Successful</strong></p>";
    } else if (val.launch_success !== null) {
      html += "<p class='launch-failure'><strong>Launch Failure</strong></p>";
    }
    if (val.rocket.first_stage.cores[0].land_success === true) {
      html += '<p class="text-info"><strong>Landing Successful</strong></p>';
    }
    var reuse = val.reuse;
    $.each(reuse, function (key, value) {
      if (value === true) {
        key = toTitleCase(key);
        html += '<p class="text-info"><strong>Reused ' + key + "</strong></p>";
      }
    });
    if (val.telemetry.flight_club !== null) {
      html +=
        '<p><a href="' +
        val.telemetry.flight_club +
        '" target="_blank">Telemetry</a></p>';
    }





    var payload = val.rocket.second_stage.payloads;
    for (i = 0; i < payload.length; i++) {

      for (j = 0; j < payload[i].customers.length; j++) {

      }

    }


  });
  return html;
}

function getJsonData() {
  const url = "https://api.spacexdata.com/v2/launches";
  $.getJSON(url,
    {
      launch_year: filterObject.year,
      launch_success: filterObject.launch,
      land_success: filterObject.landing
    }, function (json) {
      var html = "";

$("#main").empty();
      html = launchGen(json);


      $("#main").append(html);
      removeLoad("previousLoad");
      sortLaunchNumFirst();

      var years = [];
      var dteNow = new Date().getFullYear();
      for (i = 2006; i <= dteNow; i++) {
        years.push([i, 0]);
      }


      json.forEach(function (val) {
        for (i = 0; i < years.length; i++) {
          if (val.launch_year == years[i][0]) {
            years[i][1] += 1;
          }
        }
      });

      years.unshift(["year", "launches"]);

      $("#years").append(years);


      google.charts.load("current", { packages: ["bar"] });
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {
        var data = google.visualization.arrayToDataTable(years);

        var options = {
          chart: {
            title: "SpaceX Launches by Year",
            subtitle: "2006 to the present"
          },
          bars: "vertical",
          hAxis: { format: "", showTextEvery: 1 },
          height: 400,
          colors: ["#1b9e77", "#d95f02", "#7570b3"],
          legend: { position: "none" }
        };

        var chart = new google.charts.Bar(document.getElementById("chart_div"));

        chart.draw(data, google.charts.Bar.convertOptions(options));
      }

      removeLoad("chartLoad");

      $(window).resize(function () {
        drawChart();
      });

    });
}


function launchCountdown(launchTime) {
  var countDownDate = new Date(launchTime * 1000);


  var x = setInterval(function () {

    var now = new Date().getTime();


    var distance = countDownDate - now;


    var days = Math.floor(distance / (1000 * 60 * 60 * 24));
    var hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((distance % (1000 * 60)) / 1000);


    document.getElementById("launchCountdown").innerHTML =
      days + "d " + hours + "h " + minutes + "m " + seconds + "s ";


    if (distance < 0) {
      clearInterval(x);
      document.getElementById("launchCountdown").innerHTML = "Estimated Launch Time Reached";
    }
    $("#launchCountdown").css("opacity", "1");
  }, 1000);
}

$("#sortLaunchFirst").on("click", sortLaunchNumFirst);
$("#sortLaunchLast").on("click", sortLaunchNumLast);

$("#SucessfullLaunchTrue").click(function (event) {
  const name = event.target.name;
  var buttonText = $(this).text();
  filterObject[name] = buttonText === 'True' ? true : false;
  getJsonData();
})
$("#SucessfullLaunchFalse").click(function (event) {
  const name = event.target.name;
  var buttonText = $(this).text();
  filterObject[name] = buttonText === 'True' ? true : false;
  getJsonData();
})

$("#SucessfullLandingTrue").click(function (event) {
  const name = event.target.name;
  var buttonText = $(this).text();
  filterObject[name] = buttonText === 'True' ? true : false;
  getJsonData();
})
$("#SucessfullLandingFalse").click(function (event) {
  const name = event.target.name;
  var buttonText = $(this).text();
  filterObject[name] = buttonText === 'True' ? true : false;
  getJsonData();
})



function sortSpaceData(event) {
  console.log(event, "sbdjhsbkfjbsdkj")
}

function sortLaunchNumFirst() {
  var divList = $("#main .launch");
  divList.sort(function (a, b) {
    return $(b).data("launch") - $(a).data("launch");
  });
  $("#main").html(divList);
  $("#sortLaunchFirst").hide();
  $("#sortLaunchLast").show();
}

function sortLaunchNumLast() {
  var divList = $("#main .launch");
  divList.sort(function (a, b) {
    return $(a).data("launch") - $(b).data("launch");
  });
  $("#main").html(divList);
  $("#sortLaunchLast").hide();
  $("#sortLaunchFirst").show();
}

function toTitleCase(str) {
  str = str.replace("_", " ");
  return str.replace(/(?:^|\s)\w/g, function (match) {
    return match.toUpperCase();
  });
}

function removeLoad(loadId) {
  loadId = "#" + loadId;
  $(loadId).remove();
}

$(document).ready(function () {

  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $(".scrollToTop").fadeIn();
    } else {
      $(".scrollToTop").fadeOut();
    }
  });


  $(".scrollToTop").click(function () {
    $("html, body").animate({ scrollTop: 0 }, 800);
    return false;
  });
});

yearButton();
getJsonData();

