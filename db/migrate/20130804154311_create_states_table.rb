class CreateStatesTable < ActiveRecord::Migration
  def up
    create_table :states do |t|
      t.string :state_name
      t.float :kwh_per_year
      t.float :barrels_of_oil_per_year
      t.timestamps
    end
  end

  def down
    drop_table :states
  end
end
