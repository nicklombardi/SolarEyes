require 'spec_helper'

describe HomeController do

  describe "GET #index" do
    let(:states) {State.all}
    it "populates an array of states" do
      get :index
      assigns(:states).should eq(states)
    end
  end

  describe "GET #get_oil_price" do
    it "assigns @oil_price" do
      get :get_oil_price
      assigns(:oil_price).should_not eq(nil)
    end
    it "assigns a float to @oil_price" do
      get :get_oil_price
      assigns(:oil_price).class.should eq(Float)
    end
  end

end