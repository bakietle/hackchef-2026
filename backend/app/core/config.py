#Store environment variables and configuration settings
#Load values from .env, such as: database URL,JWT secret, OpenAI API key, app name
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")