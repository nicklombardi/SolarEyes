# Load the rails application
require File.expand_path('../application', __FILE__)

# Initialize the rails application
SolarEyes::Application.initialize!

ActionMailer::Base.smtp_settings = {
  :address        => 'smtp.sendgrid.net',
  :port           => '587',
  :authentication => :plain,
  :user_name      => ENV['app17329511@heroku.com'],
  :password       => ENV['3hqxdrub'],
  :domain         => 'solareyes.herokuapp.com',
  :enable_starttls_auto => true
}