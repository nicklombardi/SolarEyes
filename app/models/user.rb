class User < ActiveRecord::Base
    include MailForm::Delivery

    attr_accessible :email, :name, :created_at, :first_name, :last_name, :password, :password_confirmation, :remember_me, :provider, :uid, :as => [:default, :admin]
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable
  # attr_accessible :title, :body
  def headers
    {
      :to => "your.email@your.domain.com",
      :subject => "User created an account"
    }
  end
end
