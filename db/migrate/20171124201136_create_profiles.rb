class CreateProfiles < ActiveRecord::Migration[5.1]
  def change
    create_table :profiles do |t|
      t.string :name
      t.string :gender
      t.string :userId
      t.integer :age
      t.integer :feet
      t.integer :inch
      t.integer :weight
      t.string :fitnessGoal
      t.string :token

      t.timestamps
    end
  end
end
