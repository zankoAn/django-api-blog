from django.contrib.postgres.fields import ArrayField
from django_filters.rest_framework import CharFilter, FilterSet, DateFilter

from blog.article.models import Article


class ArticleFilter(FilterSet):
    title = CharFilter(field_name="title", lookup_expr="icontains")
    published_date = DateFilter(
        field_name="published", input_formats=["%Y-%m-%d"], lookup_expr="exact"
    )

    class Meta:
        model = Article
        fields = {
            "title": ["exact"],
            "tags": ["exact"],
            "view_cnt": ["exact", "range"],
            "categories": ["exact"],
            "published": ["exact"],
            "is_commentable": ["exact"],
            "author": ["exact"],
        }

        filter_overrides = {
            ArrayField: {
                "filter_class": CharFilter,
                "extra": lambda f: {"lookup_expr": "icontains"},
            }
        }
