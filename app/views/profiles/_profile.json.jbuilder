json.extract! profile, :id, :name, :gender, :userId, :age, :feet, :inch, :weight, :fitnessGoal, :token, :created_at, :updated_at
json.url profile_url(profile, format: :json)
