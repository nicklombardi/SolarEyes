require 'spec_helper'

describe DataController do
  describe "routing" do

    it "routes to #index" do
      get("/data").should route_to("data#index")
    end

  end
end