class AddUserIdToWeights < ActiveRecord::Migration[5.1]
  def change
    add_column :weights, :userId, :string
  end
end
