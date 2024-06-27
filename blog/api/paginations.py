from rest_framework import pagination


class ArticlePagination(pagination.CursorPagination):
    ordering = "-published"
    page_size = 5
    page_size_query_param = "page_size"


class CategoryPagination(pagination.PageNumberPagination):
    ordering = "-published"
    page_size = 5
    page_size_query_param = "page_size"


class UserPagination(pagination.CursorPagination):
    ordering = "-date_joined"
    page_size = 10
    page_size_query_param = "page_size"
