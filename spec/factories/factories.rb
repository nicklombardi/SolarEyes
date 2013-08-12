FactoryGirl.define do

  factory :state do
    state_name 'New York'
    kwh_per_year 45000
    barrels_of_oil_per_year 27.00
  end

  factory :user do
    email 'bubbalicious@gmail.com'
    first_name 'Chris'
    last_name 'Hemsworth'
    password 'iamthor'
    password_confirmation 'iamthor'
  end

  factory :invalid_user, parent: :user do
    first_name nil
  end

end