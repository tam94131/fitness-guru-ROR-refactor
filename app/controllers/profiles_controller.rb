class ProfilesController < ApplicationController
  before_action :set_profile, only: [:show, :edit, :update, :destroy]

  # GET /profiles
  # GET /profiles.json
  def index
    @profiles = Profile.all
  end

  # GET /profiles/1
  # GET /profiles/1.json
  def show
    @weights_count = Weight.count
    @weights = Weight.where(userId: @profile.userId)
    @BMI = calc_BMI @profile.weight, @profile.feet, @profile.inch
    @BMI_message = calc_BMI_message(@BMI)
    @recommend = profileToRecomm @profile.fitnessGoal, @BMI_message 
  end

  # GET /profiles/new
  def new
    @profile = Profile.new
  end

  # GET /profiles/1/edit
  def edit
  end

  # POST /profiles
  # POST /profiles.json
  def create
    @profile = Profile.new(profile_params)

    respond_to do |format|
      if @profile.save
        format.html { redirect_to @profile, notice: 'Profile was successfully created.' }
        format.json { render :show, status: :created, location: @profile }
      else
        format.html { render :new }
        format.json { render json: @profile.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /profiles/1
  # PATCH/PUT /profiles/1.json
  def update
    respond_to do |format|
      if @profile.update(profile_params)
        format.html { redirect_to @profile, notice: 'Profile was successfully updated.' }
        format.json { render :show, status: :ok, location: @profile }
      else
        format.html { render :edit }
        format.json { render json: @profile.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /profiles/1
  # DELETE /profiles/1.json
  def destroy
    @profile.destroy
    respond_to do |format|
      format.html { redirect_to profiles_url, notice: 'Profile was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_profile
      @profile = Profile.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def profile_params
      params.require(:profile).permit(:name, :gender, :userId, :age, :feet, :inch, :weight, :fitnessGoal, :token)
    end
end

def calc_BMI (weight, feet, inch)
  weight_pounds = weight
  height_inches = feet * 12 + inch
  kg = weight_pounds / 2.2
  m = height_inches * 0.0254

  # puts weight_pounds, height_inches, kg, m
  # var bmi = Math.round(kg / Math.pow(m,2) * 10)/10;
  (kg / m ** 2 * 10).round.to_f / 10
end 

def calc_BMI_message (bmi)
  if bmi<18.5
    return "Underweight"
  elsif bmi>=25 
    return "Overweight"
  else
    return "Healthy"
  end
end

def profileToRecomm( fitness_goal, bmi_string )
 resistance = [
  'Recommend a moderate amount of resistance exercise.  
  Do a variety of exercises, for various body parts.  
  Lift the maximum amount of weight possible for 6-8 reps per set.
  This rep-range will help you build strength.', 
  'Recommend a moderate amount of resistance exercise.  
  Do a variety of exercises, for various body parts.  
  Lift the maximum amount of weight possible for 10-12 reps per set.
  This rep-range will help you build muscle.',
  'Recommend a moderate amount of resistance exercise.  
  Do a variety of exercises, for various body parts.  
  Lift the maximum amount of weight possible for 14+ reps per set.
  This rep-range will help you increase your condition.'
  ]

cardio = [
  'Recommend a moderate amount of cardiovascular exercise 2 times per week for 15-20 minutes.  
  Your heart rate should stay in zone 3 or 4 for your age as indicated by the chart. 
  That will be 70-80% or 80-90% of maximum heart rate', 
  'Recommend a moderate amount of cardiovascular exercise 2 times per week for 15-20 minutes.  
  Your heart rate should stay in zone 2 or 3 for your age as indicated by the chart. 
  That will be 60-70% or 70-80% of maximum heart rate.
  To target burning fat, aim for zone 2 and increase time to 30+ minutes.', 
  'Recommend a moderate amount of cardiovascular exercise 3 times per week for 15-20 minutes.  
  Your heart rate should stay in zone 2 or 3 for your age as indicated by the chart. 
  That will be 60-70% or 70-80% of maximum heart rate.
  To target burning fat, aim for zone 2 and increase time to 30+ minutes.'
  ]

 nutrition = [
  'All calories are made up of macronutrients.  
  For your goal, it is recommended that those calories come 30% from protein, 40% from carbs and 30% from fat.',
  'All calories are made up of macronutrients.  
  For your goal, it is recommended that those calories come 35% from protein, 40% from carbs and 25% fat.', 
  'All calories are made up of macronutrients.  
  For your goal, it is recommended that those calories come 25% from protein, 50% from carbs and 25% from fat.'
  ]

 weightLoss = [
  'It is also recommended that you reduce your overall calories to lose weight.  
  Try reducing your overall calories by 500 calories per day.',
  'It is also recommended that you increase your overall calories to gain weight.  
  Try adding to your overall calories by 500 calories day.',
  'Your current weight is healthy!  Keep your calories about the same.'
  ]

 resources = [
  'https://www.aworkoutroutine.com/the-beginner-weight-training-workout-routine/', 
  'images/Heart-Rate-Training-Zone-Chart.jpg',
  'http://www1.msjc.edu/hs/nutr100/diet_diary.html'
  ]

  fitness_goal_lower = fitness_goal.downcase
  index_str = "sbc".index fitness_goal_lower[0]
  # puts index_str

  recommendation = Hash.new
  recommendation['resistance'] = resistance[index_str]
  recommendation['cardio']     = cardio[index_str]
  recommendation['nutrition']  = nutrition[index_str]

  bmi_str_lower = bmi_string.downcase
  index_str = "ouh".index bmi_str_lower[0]    #is overweight | underweight | healthy
  recommendation['nutrition'] += '  ' + weightLoss[index_str]

  recommendation['resources']  = resources 
  # recommendation['resistance'] += '<p>' + resources[0] + '</p>'
  # recommendation['cardio']     += '<p>' + resources[1] + '</p>'
  # recommendation['nutrition']  += '<p>' + resources[2] + '</p>'
  
  return recommendation;
end
