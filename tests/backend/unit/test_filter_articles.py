import pytest
from blog.api.filters import ArticleFilter


@pytest.mark.parametrize(
    "filter_method,values",
    [
        (ArticleFilter().filter_by_date, ["", None]),
        (ArticleFilter().filter_by_category_type, ["", None]),
        (ArticleFilter().filter_by_categories, ["", None]),
        (ArticleFilter().order_by_field, ["", None]),
        (ArticleFilter().filter_by_metadata, ["", None]),
    ],
)
def test_custom_filter_with_empty_or_null_values(mocker, filter_method, values):
    mock_queryset = mocker.MagicMock()
    mock_queryset.filter.return_value = []
    for value in values:
        result = filter_method(mock_queryset, "", value)
        assert result == mock_queryset


@pytest.mark.parametrize(
    "filter_method,values",
    [
        (ArticleFilter().filter_by_date, ["t-t-t-t", "t-t-t"]),
        (ArticleFilter().filter_by_metadata, ["test", "test:test:test"]),
    ],
)
def test_custom_filters_with_invalid_values(mocker, filter_method, values):
    mock_queryset = mocker.MagicMock()
    mock_queryset.filter.return_value = "test"
    for value in values:
        result = filter_method(mock_queryset, "", value)
        assert result == mock_queryset
