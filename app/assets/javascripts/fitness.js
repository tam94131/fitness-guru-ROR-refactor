
/* Function takes a user profile object 
   Function returns object!  Two prop: .bmi, .bmiStr */
function calcBMI (user) {
  weightPounds = user.weight;
  heightInches = user.feet * 12 + user.inch;

	var kg = weightPounds / 2.2;
  var m = heightInches * 0.0254;
  var bmi = Math.round(kg / Math.pow(m,2) * 10)/10;
  console.log(bmi);
  	if ( bmi<18.5 ) {
  		var bmiStr = "Underweight";
  	} else if ( bmi>=25 ) {
  		var bmiStr = "Overweight";
  	} else {
  		var bmiStr = "Healthy";
  	}
	return ({'bmi':bmi,'bmiStr':bmiStr});
}


var resistance = [
	`Recommend a moderate amount of resistance exercise.  
  Do a variety of exercises, for various body parts.  
  Lift the maximum amount of weight possible for 6-8 reps per set.
  This rep-range will help you build strength.`, 
  `Recommend a moderate amount of resistance exercise.  
  Do a variety of exercises, for various body parts.  
  Lift the maximum amount of weight possible for 10-12 reps per set.
  This rep-range will help you build muscle.`,
	`Recommend a moderate amount of resistance exercise.  
  Do a variety of exercises, for various body parts.  
  Lift the maximum amount of weight possible for 14+ reps per set.
  This rep-range will help you increase your condition.`
  ];

var cardio = [
	`Recommend a moderate amount of cardiovascular exercise 2 times per week for 15-20 minutes.  
  Your heart rate should stay in zone 3 or 4 for your age as indicated by the chart. 
  That will be 70-80% or 80-90% of maximum heart rate`, 
  `Recommend a moderate amount of cardiovascular exercise 2 times per week for 15-20 minutes.  
  Your heart rate should stay in zone 2 or 3 for your age as indicated by the chart. 
  That will be 60-70% or 70-80% of maximum heart rate.  </p><p>
  To target burning fat, aim for zone 2 and increase time to 30+ minutes.`, 
  `Recommend a moderate amount of cardiovascular exercise 3 times per week for 15-20 minutes.  
  Your heart rate should stay in zone 2 or 3 for your age as indicated by the chart. 
  That will be 60-70% or 70-80% of maximum heart rate.  </p><p>
  To target burning fat, aim for zone 2 and increase time to 30+ minutes.`
  ];

var nutrition = [
	`All calories are made up of macronutrients.  
  For your goal, it is recommended that those calories come 30% from protein, 40% from carbs and 30% from fat.`,
  `All calories are made up of macronutrients.  
  For your goal, it is recommended that those calories come 35% from protein, 40% from carbs and 25% fat.`, 
  `All calories are made up of macronutrients.  
  For your goal, it is recommended that those calories come 25% from protein, 50% from carbs and 25% from fat.`
  ];

var weightLoss = [
  `It is also recommended that you reduce your overall calories to lose weight.  
  Try reducing your overall calories by 500 calories per day.`,
  `It is also recommended that you increase your overall calories to gain weight.  
  Try adding to your overall calories by 500 calories day.`,
  `Your current weight is healthy!  Keep your calories about the same.`
];

var resources = [
  `<a href="https://www.aworkoutroutine.com/the-beginner-weight-training-workout-routine/" 
  target="_blank">Beginner workout routine</a>`,
  `<a href="images/Heart-Rate-Training-Zone-Chart.jpg" target="_blank">Cardio Zone Chart</a>`,
  `<a href="http://www1.msjc.edu/hs/nutr100/diet_diary.html" target="_blank">Example diet diary</a>`
];


function profileToRecomm( userProfile, bmi ) {
	var fitnessGoal = userProfile.fitnessGoal.toLowerCase();
  var indexStr = "sbc".indexOf(fitnessGoal[0]);    //fitnessGoal = strength | build | condition

  var recommendation = {};
  recommendation.resistance = `<p>${resistance[indexStr]}</p>`;
  recommendation.cardio = `<p>${cardio[indexStr]}</p>`;
  recommendation.nutrition = `<p>${nutrition[indexStr]}</p>`;

  var bmiStr = bmi.bmiStr.toLowerCase();
  var indexStr = "ouh".indexOf(bmiStr[0]);        //bmiStr = overweight | underweight | healthy
  recommendation.nutrition += "<p>" + weightLoss[indexStr] + "</p>";

  recommendation.resistance += `<p>${resources[0]}</p>`;
  recommendation.cardio += `<p>${resources[1]}</p>`;
  recommendation.nutrition += `<p>${resources[2]}</p>`;

  // var middleWeight = 21.75 * (height * 0.0254) ** 2;
  
  return recommendation;
}


/***** for calcing BMR -- for future *****/
//Men	BMR = 66 + ( 6.2 × weight in pounds ) + ( 12.7 × height in inches ) – ( 6.76 × age in years )
//Women BMR = 655.1 + ( 4.35 × weight in pounds ) + ( 4.7 × height in inches ) - ( 4.7 × age in years )
