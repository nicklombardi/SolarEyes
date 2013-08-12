# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do

  factory :user do
    email 'bubbalicious@gmail.com'
    first_name 'Chris'
    last_name 'Hemsworth'
    password 'iamthorlokisux'
    password_confirmation 'iamthorlokisux'
  end

  factory :invalid_user, parent: :user do
    first_name nil
  end

end