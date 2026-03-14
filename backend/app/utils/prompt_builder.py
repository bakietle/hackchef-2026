from app.models.meal_plan_requests import MealPlanRequest


def build_recipe_generation_prompt(
    request_row: MealPlanRequest,
    recipe_count: int = 35,
) -> str:
    return f"""
You are generating recipes for a student.
If the user specifies the number of recipes they want, you MUST return exactly that many recipes. If not specified, return exactly {recipe_count} recipes.

User requirements:
- Budget per meal: {request_row.budget_per_meal}
- Max cooking time: {request_row.time_per_meal} minutes
- Dietary: {request_row.dietary}
- Mode: {request_row.mode}
- Cuisine type: {request_row.cuisine_type}

Rules:
- Recipes must be realistic, and student-friendly.
-The simplicity or complexityof the dishes depends on user's selected mode and budget.
- Keep recipes practical.
- Avoid duplicates.
- Titles must be different from each other.
- Ingredients must be short strings only.
- Steps must be short strings only.
- Nutrition values must be integers.
-Fun facts should be fun and interesting, but also related to the recipe.

Return ONLY valid JSON.
Do NOT return markdown.
Do NOT wrap JSON in triple backticks.

Return a JSON array of exactly {recipe_count} objects if user dont specified the number of recipes.

Each object must have exactly these keys:
- title
- ingredients
- steps
- calories
- protein
- carbs
- fat
- funfacts


Example of ONE recipe object:
{{
  "title": "Tofu Rice Bowl",
  "ingredients": ["tofu", "rice", "soy sauce", "carrot"],
  "steps": ["Cook rice", "Pan-fry tofu", "Add carrot", "Serve with soy sauce"],
  "calories": 450,
  "protein": 22,
  "carbs": 55,
  "fat": 12,
  "funfacts": "Tofu is made from soybeans and is a great source of plant-based protein."

}}
""".strip()