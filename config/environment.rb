# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
SolarEyes::Application.initialize!

ActionMailer::Base.smtp_settings = {
  :address => "smtp.sendgrid.net",
  :port => 25,
  :domain => "solarey.es",
  :authentication => :plain,
  :user_name => "app17329511@heroku.com",
  :password => "3hqxdrub"
}