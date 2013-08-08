class NotificationsMailer < ActionMailer::Base

  default :from => "app17329511@heroku.com"
  default :to => "nicklombardi@gmail.com"

  def new_message(message)
    @message = message
    mail(:subject => "SolarEyes")
  end

end