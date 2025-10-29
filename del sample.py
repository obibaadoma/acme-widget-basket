calculation_to_hours = 24;
name_of_unit = "hours";

def days_to_units(num_of_days, custom_message):
 print(f"{num_of_days} days are {num_of_days *calculation_to_hours} {name_of_unit}");
 print(custom_message);

user_input = input("Enter the number of days and i will convert it to hours! \n")


def scope_check(num_of_days):
 my_var = "sample local variable";
 print(my_var);

days_to_units(20);
user_input = input("Enter the number of days and i will convert it to hours")
print(user_input);