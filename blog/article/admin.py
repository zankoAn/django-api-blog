from django.contrib import admin

from blog.article.models import Article, Category


@admin.register(Article)
class ArticleAdmin(admin.ModelAdmin):
    list_display = ("id", "title", "author", "status", "view_cnt", "is_commentable")
    list_display_links = ("id", "title")
    list_editable = ("status",)
    search_fields = ("title", "author", "tags", "status")


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ("id", "name")
    list_display_links = ("id",)
    list_editable = ("name",)
    search_fields = ("name",)
