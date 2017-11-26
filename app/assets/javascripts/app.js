//user profile stored here once logged in
let currentUser = {};
//user weight history stored here once logged in
let currentWeightHistory = {};
//Admin account
let adminArray = ["sherwin", "tam94131"];

/* CLIENT-SIDE JS*/
$(document).ready(function() {
    //sanity check!
    console.log('app.js loaded!');

    //initiate page
    hideAll();
    $('#built-in-content').show();
    let isLogIn = false;

//COOKIE LOG IN START
    let userCookie = getCookie("FITNESS_GURU_ID");
    console.log("userCookie: ", userCookie);
    if (userCookie) {
        $.ajax({
            method: 'GET',
            url: '/profile/cookie',
            data: userCookie,
            success: logInProfile,
            error: handleError
        })
        console.log("got an cookie!!!log in!!")
    }else{
      //Call logOut function to reinitiate the page and draw scatter chart
      logOut();
    }
//COOKIE LOG IN END

//On click listener for log in (sign in) button
    $('#log-in-btn').on('click', function() {
        hideAll();
        $('#log-in-panel').show();
    })

//On click listener for create button(sign up)
    $('#create-btn').on('click', function() {
        hideAll();
        $('#create-form-panel').show();
    })

//On click listener for update weight button
    $('#update-weight-btn').on('click', function() {
        $('#show-weight').hide();
        $('#new-weight').show();
    })

//On click listener for update fitness goal button
    $('#update-goal-btn').on('click', function() {
        $('#show-goal').hide();
        $('#new-goal').show();
    })

//On submit listener for submitting new account data
    $('#create-form').on('submit', createFormOnSubmit);
//On submit listener for submitting log in request
    $('#log-in-submit').on('submit', logInOnSubmit);
//On submit listener for updating current weight/creating new weight history
    $('#update-weight').on('submit', updateWeight);
//On submit listener for updating current fitness goal
    $('#update-goal').on('submit', updateGoal);
//On click listener for logging out.
    $('#log-out-btn').on('click', logOut);

//Reinitialize the page and kill cookie
    function logOut() {
        navBarToggle();
        killCookie();
        hideAll();
        $('#built-in-content').show();
        homepageChart();
    }

//Send GET request to server and retrieve all profile data
    function homepageChart(){
      $.ajax({
        method: 'GET',
        url: '/profile/all',
        success: homepageChartOnSuccess,
        error: handleError      
      })
    }
//Draw scatter chart in homepage using the returned profile data
    function homepageChartOnSuccess(json){
      drawScatter(json);
    }
//Call this to show/hide buttons when log in statement changes
    function navBarToggle() {
        if (isLogIn) {
            $('#log-in-btn').hide();
            $('#create-btn').hide();
            $('#log-out-btn').show();
            isLogIn = false;
        } else {
            $('#log-in-btn').show();
            $('#create-btn').show();
            $('#log-out-btn').hide();
            isLogIn = true;
        }
    }
//Send GET request to retrieve all weight history of current user
    function getWeight() {
        $.ajax({
            method: 'GET',
            url: `/weight`,
            data: `userId=${currentUser.userId}`,
            success: getWeightOnSuccess,
            error: handleError
        })
    }
//ParseInt weight data, then draw the weight history chart of current user
    function getWeightOnSuccess(jsonList) {
        currentWeightHistory = jsonList.map(function(history) {
            history.weight = parseInt(history.weight);
            return history;
        })
        console.log("currentWeightHistory: ", currentWeightHistory);
        drawWeight(currentWeightHistory);
    }
//Send PUT request, change current fitness goal, then refresh the recommendation page
    function updateGoal(e) {
        e.preventDefault();
        requestData = `${$(this).serialize()}&userId=${currentUser.userId}`;
        $.ajax({
            method: 'PUT',
            url: `/profile/goal`,
            data: requestData,
            success: logInProfile,
            error: handleError
        })
    }
//Send PUT request, change current weight in profile, create new weight history data, then refresh page
    function updateWeight(e) {
        e.preventDefault();
        var t = Date();
        timeSerialize = `&time=${encodeURI(t)}`;
        requestData = `${$(this).serialize()}${timeSerialize}&userId=${currentUser.userId}`;
        $.ajax({
            method: 'PUT',
            url: `/profile/weight`,
            data: requestData,
            success: logInProfile,
            error: handleError
        })
    }

//Send GET request to server. If loged in successfully, go to recommendation page
    function logInOnSubmit(e) {
        e.preventDefault();
        console.log($(this).serialize())
        $.ajax({
            method: 'GET',
            url: '/profile',
            data: $(this).serialize(),
            success: logInProfile,
            error: handleError
        })
        console.log("get request!!!log in!!")
    }
//Send POST request to server. If new account created, go to recommendation page
    function createFormOnSubmit(e) {
        e.preventDefault();
        var t = Date();
        timeSerialize = `&time=${encodeURI(t)}`;
        requestData = $(this).serialize() + timeSerialize;
        $.ajax({
            method: 'POST',
            url: '/profile',
            data: requestData,
            success: createProfile,
            error: handleError
        })
    }
//If log in error, console log the error. If success, create cookie, and log in the recommendation page
    function logInProfile(json) {
        if (json === "login error") {
            console.log(json, "inside login error");
            alert("Oops! Wrong id or password");
        } else if (json === "cookie fail") {
            console.log("cookie fail");
            console.log("cookie: ", userCookie);
        } else {
            console.log(json, "inside render");
            setCookie("FITNESS_GURU_ID", `userId=${json.userId}`, 30);
            currentUser = json;
            renderRec(currentUser);
            isLogIn = true;
            navBarToggle();
        }
    }
//If create error, console log the error. If success, create cookie, and log in the recommendation page
    function createProfile(json) {
        if (json === "exist error") {
            console.log(json);
            alert("id already exists. Please use another one")
        } else {
            console.log(json, "inside render");
            setCookie("FITNESS_GURU_ID", `userId=${json.userId}`, 0.03);
            currentUser = json
            renderRec(currentUser);
            console.log("currentUser: ", currentUser);
            isLogIn = true;
            navBarToggle();
        }
    }
//This function handles all the error occured in ajax
    function handleError(a, b, c) {
        console.log(a, b, c);
    }
//Hide all layout in panel-body
    function hideAll() {
        $('#built-in-content').hide();
        $('#create-form-panel').hide();
        $('#log-in-panel').hide();
        $('#recommendation').hide();
        $('#change-profile-form').hide();
        $('#admin-panel').hide();
    }
//Set cookie
    function setCookie(cname, cvalue, expireDays) {
        var d = new Date();
        d.setTime(d.getTime() + (expireDays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    }
//Get cookie(if there's no matching cookie, return empty string)
    function getCookie(cname) {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    }
//Kill cookie
    function killCookie() {
        setCookie("FITNESS_GURU_ID", "", 0);
        console.log("killed cookie: ", getCookie("FITNESS_GURU_ID"));
    }
//Draw the BMI chart
    function drawBMI(bmiIn) {
        google.charts.setOnLoadCallback(drawChart);

        function drawChart() {
            var data = google.visualization.arrayToDataTable([
                ['Label', 'Value'],
                [bmiIn.bmiStr, bmiIn.bmi],
            ]);
            var options = {
                width: 400,
                height: 250,
                redFrom: 25,
                redTo: 40,
                greenFrom: 18,
                greenTo: 25,
                yellowFrom: 0,
                yellowTo: 18,
                minorTicks: 5,
                max: 35,
                min: 12,
                yellowColor: 'yellow'
            };
            var chart = new google.visualization.Gauge(document.getElementById('bmi-chart'));
            chart.draw(data, options);
        }
    }
//Draw a age/weight scatter chart. Blue dots represent male, and pink represent female
    function drawScatter(scatterDS) {
      google.charts.setOnLoadCallback(drawChart);
      function drawChart(){
        var dataArray = [['Age', 'Weight', {role:'style'} ]];
        for (var j=0; j<scatterDS.length; j++) {
            var age = parseInt(scatterDS[j].age);
            var weight = parseInt(scatterDS[j].weight);
            var gender = scatterDS[j].gender.toLowerCase();
            var genderColor = gender[0]==='m' ? 'blue' : 'pink';
            var babyArray = [age, weight, 'point { fill-color: ' + genderColor];
            dataArray.push(babyArray);
         }
        var data = google.visualization.arrayToDataTable(dataArray);
        var options = {
            title: 'Fitness Guru Community',
            pointSize: 7,
            legend: 'none',
            height: 250, width: 520, 
            hAxis: {title: 'Age'},
            vAxis: {title: 'Weight'}
        };
        var chart = new google.visualization.ScatterChart(document.getElementById('scatterDiv'));
        chart.draw(data, options);
    }   }
//Draw the weight history chart of current user
    function drawWeight(weightIn) {
        google.charts.setOnLoadCallback(drawChart);
        function drawChart() {
            var dataArray = [
                ['Date', 'Weight']
            ];
            for (var j = 0; j < weightIn.length; j++) {
                var shortTime = weightIn[j].time.substr(4, 6);
                shortTime[3] = '-';
                var babyArray = [shortTime, parseInt(weightIn[j].weight)]
                dataArray.push(babyArray);
            }
            var data = google.visualization.arrayToDataTable(dataArray);
            var options = {
                title: 'Weight History (lbs)',
                curveType: 'function',
                pointSize: 7,
                series: {
                    0: { pointShape: 'diamond' }
                },
                legend: {
                    position: 'none'
                },
                height: 250,
                width: 520

            };
            var chart = new google.visualization.LineChart(document.getElementById('weight-chart'));
            chart.draw(data, options);
        }
    }
//Get full name, return first name only.
    function getFirstName(nameIn){
      nameIn = nameIn.concat(" ");
      nameArray = nameIn.split(" ");
      return nameArray[0];
    }

//Check if current user is an administrator.
//If true, render admin dashboard. If false, do nothing.
    function checkAdmin(userIdIn){
      var isAdmin = false;
      for(var i=0; i<adminArray.length; i++){
        if(userIdIn===adminArray[i]){
          isAdmin = true;
          break;
        }
      }
      if(isAdmin){
        renderDashboard();
      }
    }

//Render dashboard(if user is an admin)
    function renderDashboard(){
      $('#admin-panel').show();
      $.ajax({
        method: 'GET',
        url: `profile/all/dashboard`,
        success: getDashboardOnSuccess,
        error: handleError
      })
    }

    function getDashboardOnSuccess(json){
      console.log(json);
      $('#db1').text(json.totalUser);
      $('#db2').text(json.totalWeight);
      $('#db3').text(json.male);
      $('#db4').text(json.female);
      $('#db5').text(json.other);
      $('#db6').text(json.avgWeight);
    }

//Render recommendation page
    function renderRec(userProfile) {
        getWeight();
        userProfile.inch = parseInt(userProfile.inch);
        userProfile.feet = parseInt(userProfile.feet);
        userProfile.weight = parseInt(userProfile.weight);
        hideAll();
        checkAdmin(userProfile.userId);
        $('#recommendation').show();
        $('#show-goal').show();
        $('#new-goal').hide();
        $('#show-weight').show();
        $('#new-weight').hide();
        var userPound = parseInt(userProfile.weight);
        // This is gonna return {'bmi':bmi,'bmiStr':bmiStr}
        var bmiObj = calcBMI(userProfile);
        drawBMI(bmiObj);
        var recObj = profileToRecomm(userProfile, bmiObj);
        $('#rec-resistance').html(recObj.resistance);
        $('#rec-cardio').html(recObj.cardio);
        $('#rec-nutrition').html(recObj.nutrition);
        $('#user-name').text(getFirstName(userProfile.name));
        $('#weightSpan').text(userPound);
        $('#goalSpan').text(userProfile.fitnessGoal.toUpperCase());
    }
});