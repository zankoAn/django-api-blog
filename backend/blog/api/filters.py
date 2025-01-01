from datetime import datetime

from django.contrib.postgres.fields import ArrayField
from django.db.models import Count, F
from django_filters.rest_framework import CharFilter, FilterSet

from blog.article.models import Article, Category


class ArticleFilter(FilterSet):
    title = CharFilter(field_name="title", lookup_expr="icontains")
    published = CharFilter(field_name="published", method="filter_by_date")
    c_type = CharFilter(method="filter_by_category_type", label="Category Type")
    categories = CharFilter(method="filter_by_categories")
    order = CharFilter(label="Order by", method="order_by_field")
    meta_f = CharFilter(label="Filter by Metadata Field", method="filter_by_metadata")
    category_slug = CharFilter(field_name="categories__slug", lookup_expr="exact")

    class Meta:
        model = Article
        fields = {
            "title": ["exact"],
            "tags": ["exact"],
            "view_cnt": ["exact", "range"],
            "published": ["exact"],
            "is_commentable": ["exact"],
            "author": ["exact"],
        }

        filter_overrides = {
            ArrayField: {
                "filter_class": CharFilter,
                "extra": lambda _: {"lookup_expr": "icontains"},
            }
        }

    def filter_by_date(self, queryset, name, value):
        if not value:
            return queryset
        try:
            parts = value.split("-")
            if len(parts) == 1:
                year = parts[0]
                return queryset.filter(published__year=year)
            if len(parts) == 2:
                year, month = parts
                return queryset.filter(published__year=year, published__month=month)
            elif len(parts) == 3:
                date_value = datetime.strptime(value, "%Y-%m-%d")
                return queryset.filter(published=date_value)
        except Exception:
            return queryset

    def filter_by_category_type(self, queryset, name, value):
        if not value:
            return queryset

        try:
            category_ids = value.split(",")
            return queryset.filter(categories__id__in=category_ids)
        except ValueError:
            return queryset

    def filter_by_categories(self, queryset, name, value):
        """
        Filters the queryset to include records that match all unique category IDs in the input.
        """
        if not value:
            return queryset

        try:
            category_ids = value.split(",")
            return (
                queryset.filter(categories__id__in=category_ids)
                .annotate(matched_categories=Count("categories__id", distinct=True))
                .filter(matched_categories__gte=len(category_ids))
            )
        except Exception:
            return queryset

    def order_by_field(self, queryset, name, value):
        if not value:
            return queryset

        if value == "view":
            return queryset.order_by("-view_cnt")

        try:
            return queryset.order_by(F(f"metadata__{value}"))
        except Exception:
            return queryset

    def filter_by_metadata(self, queryset, name, value):
        if not value:
            return queryset

        try:
            key, val = value.split(":")
            values = val.split(",")
            filter_kwargs = {f"metadata__{key}__in": values}
            return queryset.filter(**filter_kwargs)
        except Exception:
            return queryset


class CategoryFilter(FilterSet):
    parent = CharFilter(field_name="parent__name", lookup_expr="exact")

    class Meta:
        model = Category
        fields = ("parent",)
