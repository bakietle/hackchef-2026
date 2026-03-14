#Stores custom error classes or error helpers.

#Examples:

#UserAlreadyExistsError

#InvalidCredentialsError

#PlanNotFoundError

#Why useful?

#Keeps service code cleaner later.

class Exceptions:
    def UserAlreadyExistsError(self, email: str):
        return None
    
    def InvalidCredentialsError(self):
        return None
    
    