class DataController < ApplicationController

  def index
    expires_in 10.minutes, public: true
  end

end