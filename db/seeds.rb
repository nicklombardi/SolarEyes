# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)
states = State.create([ { state_name: 'Alabama', kwh_per_year: 48250, barrels_of_oil_per_year: 29.6339516029973 },
                        { state_name: 'Alaska', kwh_per_year: 32057, barrels_of_oil_per_year: 19.6886131924826 },
                        { state_name: 'Arizona', kwh_per_year: 63110, barrels_of_oil_per_year: 38.7605945215577 },
                        { state_name: 'Arkansas', kwh_per_year: 50572, barrels_of_oil_per_year: 31.0600663309177 },
                        { state_name: 'California', kwh_per_year: 62765, barrels_of_oil_per_year: 38.5487040904067 },
                        { state_name: 'Colorado', kwh_per_year: 63219, barrels_of_oil_per_year: 38.8275396142981 },
                        { state_name: 'Connecticut', kwh_per_year: 46031, barrels_of_oil_per_year: 28.2710969168408 },
                        { state_name: 'Delaware', kwh_per_year: 46411, barrels_of_oil_per_year: 28.5044834786882 },
                        { state_name: 'Florida', kwh_per_year: 52762, barrels_of_oil_per_year: 32.4051099373542 },
                        { state_name: 'Georgia', kwh_per_year: 49644, barrels_of_oil_per_year: 30.4901117798797 },
                        { state_name: 'Hawaii', kwh_per_year: 57419, barrels_of_oil_per_year: 35.2653236703109 },
                        { state_name: 'Idaho', kwh_per_year: 54494, barrels_of_oil_per_year: 33.4688613192484 },
                        { state_name: 'Illinois', kwh_per_year: 49323, barrels_of_oil_per_year: 30.2929615526349 },
                        { state_name: 'Indiana', kwh_per_year: 44037, barrels_of_oil_per_year: 27.0464316423045 },
                        { state_name: 'Iowa', kwh_per_year: 49361, barrels_of_oil_per_year: 30.3163002088196 },
                        { state_name: 'Kansas', kwh_per_year: 59196, barrels_of_oil_per_year: 36.356712934529 },
                        { state_name: 'Kentucky', kwh_per_year: 48167, barrels_of_oil_per_year: 29.5829750644885 },
                        { state_name: 'Louisiana', kwh_per_year: 48697, barrels_of_oil_per_year: 29.9084879007494 },
                        { state_name: 'Maine', kwh_per_year: 45273, barrels_of_oil_per_year: 27.8055521434714 },
                        { state_name: 'Maryland', kwh_per_year: 43447, barrels_of_oil_per_year: 26.6840682962782 },
                        { state_name: 'Massachusetts', kwh_per_year: 42787, barrels_of_oil_per_year: 26.2787126888589 },
                        { state_name: 'Michigan', kwh_per_year: 43659, barrels_of_oil_per_year: 26.8142734307825 },
                        { state_name: 'Minnesota', kwh_per_year: 46373, barrels_of_oil_per_year: 28.4811448225035 },
                        { state_name: 'Mississippi', kwh_per_year: 48106, barrels_of_oil_per_year: 29.5455103795603 },
                        { state_name: 'Missouri', kwh_per_year: 49704, barrels_of_oil_per_year: 30.5269622896451 },
                        { state_name: 'Montana', kwh_per_year: 51980, barrels_of_oil_per_year: 31.9248249600787 },
                        { state_name: 'Nebraska', kwh_per_year: 57216, barrels_of_oil_per_year: 35.1406461122713 },
                        { state_name: 'Nevada', kwh_per_year: 62975, barrels_of_oil_per_year: 38.6776808745856 },
                        { state_name: 'New Hampshire', kwh_per_year: 41966, barrels_of_oil_per_year: 25.7744748802359 },
                        { state_name: 'New Jersey', kwh_per_year: 45347, barrels_of_oil_per_year: 27.8510011055154 },
                        { state_name: 'New Mexico', kwh_per_year: 62834, barrels_of_oil_per_year: 38.5910821766369 },
                        { state_name: 'New York', kwh_per_year: 44463, barrels_of_oil_per_year: 27.3080702616387 },
                        { state_name: 'North Carolina', kwh_per_year: 48969, barrels_of_oil_per_year: 30.0755435450191 },
                        { state_name: 'North Dakota', kwh_per_year: 50957, barrels_of_oil_per_year: 31.2965237685789 },
                        { state_name: 'Ohio', kwh_per_year: 43635, barrels_of_oil_per_year: 26.7995332268764 },
                        { state_name: 'Oklahoma', kwh_per_year: 54430, barrels_of_oil_per_year: 33.4295541088319 },
                        { state_name: 'Oregon', kwh_per_year: 54343, barrels_of_oil_per_year: 33.3761208696721 },
                        { state_name: 'Pennsylvania', kwh_per_year: 46159, barrels_of_oil_per_year: 28.3497113376736 },
                        { state_name: 'Rhode Island', kwh_per_year: 46112, barrels_of_oil_per_year: 28.320845105024 },
                        { state_name: 'South Carolina', kwh_per_year: 49025, barrels_of_oil_per_year: 30.1099373541335 },
                        { state_name: 'South Dakota', kwh_per_year: 54362, barrels_of_oil_per_year: 33.3877901977645 },
                        { state_name: 'Tennessee', kwh_per_year: 48236, barrels_of_oil_per_year: 29.6253531507187 },
                        { state_name: 'Texas', kwh_per_year: 62940, barrels_of_oil_per_year: 38.6561847438891 },
                        { state_name: 'Utah', kwh_per_year: 58467, barrels_of_oil_per_year: 35.90897924087961 },
                        { state_name: 'Vermont', kwh_per_year: 42340, barrels_of_oil_per_year: 26.004176391106824 },
                        { state_name: 'Virginia', kwh_per_year: 49428, barrels_of_oil_per_year: 30.357449944724326 },
                        { state_name: 'Washington', kwh_per_year: 46367, barrels_of_oil_per_year: 28.477459771526927 },
                        { state_name: 'West Virginia', kwh_per_year: 44829, barrels_of_oil_per_year: 27.532858371207553 },
                        { state_name: 'Wisconsin', kwh_per_year: 44667, barrels_of_oil_per_year: 27.43336199484101 },
                        { state_name: 'Wyoming', kwh_per_year: 55542, barrels_of_oil_per_year: 34.11251688981708 } ])