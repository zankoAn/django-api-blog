from django.urls import include, path
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from blog.api.views import ArticleViewSet, CategoryViewSet, LoginView, UserViewSet

app_name = "api"

router = DefaultRouter()
router.register("categories", CategoryViewSet, basename="categories")
router.register("articles", ArticleViewSet, basename="articles")
router.register("users", UserViewSet, basename="users")

urlpatterns = [
    path("", include(router.urls)),
    path("user/login/", LoginView.as_view(), name="user-login"),
    path("user/refresh/", TokenRefreshView.as_view(), name="user-refresh-token"),
]
