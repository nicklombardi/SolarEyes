class HomeController < ApplicationController

  def index
    @states = State.all

    respond_to do |format|
      format.html
      format.json { render json: @states }
    end
  end

  def get_oil_price
    @oil_price = YahooFinance::get_quotes(YahooFinance::StandardQuote, 'BZG14.NYM')['BZG14.NYM'].lastTrade
    respond_to do |format|
      format.json { render json: @oil_price }
    end
  end


end