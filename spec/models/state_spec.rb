require 'spec_helper'

describe State do
  describe "mass assignment" do
    let (:state) { FactoryGirl.create :state }
    it { should allow_mass_assignment_of :state_name }
    it { should allow_mass_assignment_of :kwh_per_year }
    it { should allow_mass_assignment_of :barrels_of_oil_per_year }
  end
end