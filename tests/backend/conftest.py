import pytest
from blog.account.models import User
from blog.article.models import Article, Category


@pytest.fixture(scope="session")
def sample_login_user_data():
    return {"username": "test", "email": "test@gmail.com", "password": "test"}


@pytest.fixture(scope="session")
def sample_user(sample_login_user_data, request, django_db_blocker):
    with django_db_blocker.unblock():
        data = sample_login_user_data
        data["is_staff"] = getattr(request, "param", {}).get("user_type") == "admin"
        user = User.objects.create_user(**data)
    return user


@pytest.fixture(scope="session")
def sample_categories(django_db_setup, django_db_blocker):
    categories_data = [
        {"name": "tech"},
        {"name": "backend"},
        {"name": "frontend"},
        {"name": "movies"},
        {"name": "country-categories"},
        {"name": "china-tv"},
        {"name": "korea-tv"},
        {"name": "books"},
        {"name": "dram"},
        {"name": "romance"},
        {"name": "xinxing-xiaoyao"},
    ]
    categories = {}

    with django_db_blocker.unblock():
        for data in categories_data:
            category = Category.objects.create(**data)
            categories[category.name] = category

        parent_mapping = {
            "backend": "tech",
            "frontend": "tech",
            "china-tv": "country-categories",
            "korea-tv": "country-categories",
            "dram": "movies",
            "romance": "movies",
        }
        for child_name, parent_name in parent_mapping.items():
            categories[child_name].parent = categories[parent_name]
            categories[child_name].save()

    del categories_data, categories, parent_mapping


@pytest.fixture(scope="session")
def sample_articles_data(sample_categories):
    articles = [
        {
            "tags": ["python", "frontend", "test"],
            "title": "Django and react",
            "body": "Test",
            "categories": [1, 2, 3],
            "status": "publish",
            "published": "2024-09-26",
            "view_cnt": 5,
        },
        {
            "tags": ["python", "backend", "django"],
            "title": "Django with pytest",
            "body": "Test",
            "categories": [1, 2],
            "status": "publish",
            "published": "2021-09-26",
            "view_cnt": 25,
            "metadata": {"mx": "2"},
        },
        {
            "tags": ["frontend", "test"],
            "title": "frontend with react",
            "body": "Test",
            "categories": [1, 3],
            "status": "publish",
            "published": "2024-02-05",
            "view_cnt": 8,
            "metadata": {"mx": "1"},
        },
        {
            "tags": ["dram", "historical"],
            "title": "Word Of Honor",
            "body": "Test",
            "categories": [4, 6, 9, 10],
            "status": "publish",
            "published": "2024-08-01",
            "view_cnt": 100,
        },
        {
            "tags": ["musical", "romance"],
            "title": "Lovely Runner",
            "categories": [4, 7, 9, 10],
            "status": "publish",
            "published": "2024-03-03",
            "view_cnt": 80,
        },
        {
            "tags": ["eskay", "action", "sword"],
            "title": "chaos sword god",
            "categories": [8, 9, 11],
            "status": "publish",
            "published": "2022-01-03",
            "view_cnt": 200,
        },
    ]
    return articles


@pytest.fixture(scope="session")
def sample_article(sample_articles_data, sample_user, django_db_blocker):
    with django_db_blocker.unblock():
        for article_data in sample_articles_data:
            categories = article_data.pop("categories")
            article_data["author"] = sample_user
            article = Article.objects.create(**article_data)
            article.published = article_data["published"]
            article.categories.set(categories)
            article.save(update_fields=["published"])


@pytest.fixture(scope="session")
def categories(request, django_db_blocker):
    with django_db_blocker.unblock():
        names = request.param.split(",")
        categories_id = Category.objects.filter(name__in=names).values_list(
            "id", flat=True
        )
        categories_id = list(categories_id)

    return categories_id
