from typing import List

import pytest
from blog.article.models import Article, Category
from django.urls import reverse
from requests import Session
from rest_framework.status import HTTP_200_OK

ARTICLES_LIST_URL = reverse("api:articles-list")


@pytest.mark.django_db
@pytest.mark.parametrize(
    "key,values",
    [
        ("published", ["1-", "t-t", "$-%", "$t:/-", "t-t-t"]),
        ("c_type", ["test", "$", "1-1"]),
        ("categories", ["test", "$", "1-1", ",1,"]),
        ("order", ["test", "$", "1-1", ",1,"]),
        ("meta_f", ["*/$#^", "123"]),
    ],
)
def test_invalid_values_do_not_affect_filtering(
    sample_article, client: Session, key, values
):
    for value in values:
        params = {key: value, "page_size": 10}
        response = client.get(ARTICLES_LIST_URL, data=params)
        assert response.status_code == HTTP_200_OK

        db_articles = (
            Article.objects.all().order_by("published").values_list("title", flat=True)
        )
        response_data = response.json()
        assert response_data["count"] == db_articles.count()

        response_titles = [article["title"] for article in response_data["results"]]
        db_titles = list(db_articles)
        assert response_titles == db_titles


@pytest.mark.django_db
@pytest.mark.parametrize("date", ["2024", "2024-09", "2024-09-26"])
def test_filter_by_valid_publish_date(sample_article, client: Session, date):
    params = {"published": date}
    response = client.get(ARTICLES_LIST_URL, data=params)
    assert response.status_code == HTTP_200_OK

    response_data = response.json()
    articles = response_data["results"]
    for article in articles:
        assert article["published"].startswith(date)


@pytest.mark.django_db
def test_category_type_filter_with_valid_category_id(sample_article, client: Session):
    backend = Category.objects.get(name="backend").id
    params = {"c_type": backend}
    response = client.get(ARTICLES_LIST_URL, data=params)
    assert response.status_code == HTTP_200_OK

    # We have 2 match article with backend category
    response_data = response.json()
    assert response_data["count"] == 2

    articles = response_data["results"]
    for article in articles:
        assert backend in article["categories"]


@pytest.mark.django_db
@pytest.mark.parametrize("categories", ["backend", "backend,frontend"], indirect=True)
def test_category_type_filter_with_valid_categories(
    sample_article, categories: List[int], client: Session
):
    params = {"c_type": ",".join(map(str, categories))}
    response = client.get(ARTICLES_LIST_URL, data=params)
    assert response.status_code == HTTP_200_OK

    articles = response.json()["results"]
    for article in articles:
        assert set(article["categories"]) & set(categories)


@pytest.mark.django_db
@pytest.mark.parametrize(
    "categories", ["korea-tv,dram", "backend,frontend"], indirect=True
)
def test_filter_by_multiple_categories(
    sample_article, categories: List[int], client: Session
):
    """
    Test that articles contain all specified categories in the response.
    """
    params = {"categories": ",".join(map(str, categories))}
    response = client.get(ARTICLES_LIST_URL, data=params)
    assert response.status_code == HTTP_200_OK

    response_data = response.json()
    articles = response_data["results"]
    for article in articles:
        assert set(categories).issubset(article["categories"])


@pytest.mark.django_db
@pytest.mark.parametrize(
    "categories", ["china-tv,books", "korea-tv,backend"], indirect=True
)
def test_no_articles_returned_when_categories_do_not_match(
    sample_article, categories: List[int], client: Session
):
    """
    No articles are returned if all specified categories do not fully match
    """
    params = {"categories": ",".join(map(str, categories))}
    response = client.get(ARTICLES_LIST_URL, data=params)
    assert response.status_code == HTTP_200_OK
    response_data = response.json()
    assert response_data["count"] == 0


@pytest.mark.django_db
def test_ordred_by_view_count_filter(sample_article, client: Session):
    params = {"order": "view"}
    response = client.get(ARTICLES_LIST_URL, data=params)
    assert response.status_code == HTTP_200_OK

    response_data = response.json()
    articles = response_data["results"]
    views = [article["view_cnt"] for article in articles]
    assert views == sorted(views, reverse=True)


@pytest.mark.django_db
def test_order_by_metadata_key_filter(sample_article, client: Session):
    params = {"order": "mx"}
    response = client.get(ARTICLES_LIST_URL, data=params)
    assert response.status_code == 200

    response_data = response.json()
    articles = response_data["results"]
    metax_ids = [
        article["metadata"]["mx"] for article in articles if article["metadata"]
    ]
    assert metax_ids == sorted(metax_ids)


@pytest.mark.django_db
def test_metadata_filter_applied_correctly(sample_article, client: Session):
    params = {"meta_f": "mx:1"}
    response = client.get(ARTICLES_LIST_URL, data=params)
    assert response.status_code == HTTP_200_OK

    response_data = response.json()
    articles = response_data["results"]
    for article in articles:
        assert article["metadata"]["mx"] == "1"


@pytest.mark.django_db
@pytest.mark.parametrize(
    "query",
    [
        # 6 -> china country category
        # 7 -> korea country category
        {"category_slug": "movies", "published": "2024", "order_by": "view_cnt"},
        {"c_type": 6, "category_slug": "movies", "page_size": 5},
        {"category_slug": "movies", "categories": "9,10"},
        {"c_type": 6, "category_slug": "movies", "published": "2024-08"},
        {"category_slug": "books", "tags": "action"},
        {"c_type": 11, "category_slug": "books", "tags": "eskay"},
    ],
)
def test_combining_multiple_filters(sample_article, query, client: Session):
    response = client.get(ARTICLES_LIST_URL, data=query)
    assert response.status_code == HTTP_200_OK

    response_data = response.json()
    assert response_data["count"] >= 1

    articles = response_data["results"]
    for article in articles:
        if _categories := query.get("categories"):
            for category in _categories.split(","):
                assert int(category) in article["categories"]

        if query.get("published"):
            assert article["published"].startswith(query["published"])

    order_by = query.get("order_by")
    if order_by:
        views = [article["view_cnt"] for article in articles]
        assert views == sorted(views)
