require 'spec_helper'

describe HomeController do

  describe "GET #index" do
    let(:states) {State.all}
    it "populates an array of states" do
      get :index
      assigns(:states).should eq(states)
    end
  end

end