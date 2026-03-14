#Stores fixed values used across the app.

#Examples:

#allowed meal types

#allowed modes

#allowed cuisines

#default status strings

#Why useful?

#Instead of repeating magic words like "draft" or "gym_mode" everywhere, define them once.
from pyclbr import Class

global Modes

class Modes:
    def __init__(self):
        self.cuisine = None
        self.meal_type = None
        self.mode = None

    def Cuisines(self, cuisineSelection : int):
        available_cuisines = ["italian", "mexican", "chinese", "indian", "american"]
        return self.cuisine == available_cuisines[cuisineSelection]
    
    def MealTypes(self, mealTypeSelection : int):
        available_meal_types = ["breakfast", "lunch", "dinner", "snack"]
        return self.meal_type == available_meal_types[mealTypeSelection]
    
    def Modes(self, modeSelection : int):
        available_modes = ["gym_mode", "relaxation_mode", "weight_loss_mode", "muscle_gain_mode"]
        return self.mode == available_modes[modeSelection]
    

