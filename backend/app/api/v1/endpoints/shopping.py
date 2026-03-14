from fastapi import APIRouter

router = APIRouter(prefix="/shopping", tags=["Shopping"])


@router.get("/{user_id}")
def get_shopping_list(user_id: int):

    return {
        "items": [
            "eggs",
            "rice",
            "tomatoes",
            "chicken"
        ]
    }