from django.contrib.postgres.fields import ArrayField
from django_filters.rest_framework import CharFilter, FilterSet

from blog.article.models import Article


class ArticleFilter(FilterSet):
    title = CharFilter(field_name="title", lookup_expr="icontains")

    class Meta:
        model = Article
        fields = {
            "title": ["exact"],
            "tags": ["exact"],
            "view_cnt": ["exact", "range"],
            "categories": ["exact"],
            "published": ["day__gt", "day__lt"],
            "is_commentable": ["exact"],
            "author": ["exact"],
        }

        filter_overrides = {
            ArrayField: {
                "filter_class": CharFilter,
                "extra": lambda f: {"lookup_expr": "icontains"},
            }
        }
