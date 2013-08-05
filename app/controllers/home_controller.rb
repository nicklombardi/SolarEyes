class HomeController < ApplicationController

  def index
    @states = State.all
    respond_to do |format|
      format.html
      format.json { render json: @states }
    end
  end

end