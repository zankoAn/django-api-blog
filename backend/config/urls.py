from django.conf import settings
from django.contrib import admin
from django.urls import include, path
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)

urlpatterns = [
    path("api/v1/schema/", SpectacularAPIView.as_view(), name="schema"),
    path("api/v1/swagger-ui/", SpectacularSwaggerView.as_view(), name="swagger-ui"),
    path("api/v1/redoc/", SpectacularRedocView.as_view(), name="redoc"),
    path("api/v1/", include("blog.api.urls", namespace="api")),
    path("admin/", admin.site.urls),
]

if settings.DEBUG:
    urlpatterns += [
        path("__debug__/", include("debug_toolbar.urls")),
        path("api-auth/", include("rest_framework.urls", namespace="rest_framework"))
    ]
