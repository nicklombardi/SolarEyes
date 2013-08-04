class State < ActiveRecord::Base
  attr_accessible :state_name, :kwh_per_year, :barrels_of_oil_per_year
end