require 'spec_helper'

describe UsersController do

  context "with valid attributes" do
    it "creates a new user" do
      expect{ post :create, user: FactoryGirl.attributes_for(:user)
      }.to change(User,:count).by(1)
    end

    it "redirects to the new user" do
      post :create, user: FactoryGirl.attributes_for(:user)
      response.should redirect_to User.last
    end
  end

  context "with invalid attributes" do
    it "does not save the new user" do
      expect{ post :create, user: FactoryGirl.attributes_for(:invalid_user)
      }.to_not change(User,:count)
    end

    it "re-renders the new method" do
      post :create, user: FactoryGirl.attributes_for(:invalid_user)
      response.should render_template :new
    end
  end

end