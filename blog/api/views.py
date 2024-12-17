import base64

from django.http import Http404
from django_filters import rest_framework as filters
from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema
from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.views import TokenObtainPairView

from blog.account.models import Resume, User
from blog.api.filters import ArticleFilter, CategoryFilter
from blog.api.paginations import ArticlePagination, CategoryPagination, UserPagination
from blog.api.permissions import (
    AdminOrStaffCanModify,
    IsAdminOrAuthor,
    IsReadOrCreateAllowed,
)
from blog.api.serializers import (
    CreateArticleSerializer,
    CreateCategorySerializer,
    CreateUserSerializer,
    LoginSerializer,
    ResumeSerializer,
    RetrieveCategorySerializer,
    RetriveArticleSerializer,
    RetriveUserSerializer,
    UpdateArticleSerializer,
    UpdateUserSerializer,
)
from blog.article.models import Article, Category


class BaseModelViewSet(viewsets.ModelViewSet):
    def retrieve(self, request, *args, **kwargs):
        try:
            return super().retrieve(request, *args, **kwargs)
        except Http404:
            return Response(
                {"error": "Object Not found"}, status=status.HTTP_404_NOT_FOUND
            )

    @extend_schema(
        parameters=[OpenApiParameter("id", OpenApiTypes.STR, OpenApiParameter.PATH)]
    )
    def partial_update(self, request, *args, **kwargs):
        try:
            return super().partial_update(request, *args, **kwargs)
        except Http404:
            return Response(
                {"error": "Object Not found"}, status=status.HTTP_404_NOT_FOUND
            )

    def update(self, request, *args, **kwargs):
        try:
            return super().update(request, *args, **kwargs)
        except Http404:
            return Response(
                {"error": "Object Not found"}, status=status.HTTP_404_NOT_FOUND
            )

    @extend_schema(
        responses = {
            status.HTTP_202_ACCEPTED: {
                "type": "object",
                "properties": {
                    "msg": {"type":"string", "example": "Object was successfully deleted"}
                }
            },
             status.HTTP_404_NOT_FOUND: {
                "type": "object",
                "properties": {
                    "msg": {"type":"string", "example": "Object Not Found"}
                }
            },

        }
    )
    def destroy(self, request, *args, **kwargs):
        try:
            super().destroy(request, *args, **kwargs)
            return Response(
                {"msg": "Object was successfully deleted"},
                status=status.HTTP_202_ACCEPTED,
            )
        except Http404:
            return Response(
                {"error": "Object Not found"}, status=status.HTTP_404_NOT_FOUND
            )


class ArticleViewSet(BaseModelViewSet):
    queryset = (
        Article.objects.filter(status=Article.StatusChoices.publish)
        .prefetch_related("categories")
        .order_by("published")
        .distinct()
    )
    permission_classes = (IsAdminOrAuthor,)
    pagination_class = ArticlePagination
    filterset_class = ArticleFilter
    filter_backends = (filters.DjangoFilterBackend,)
    http_method_names = ("get", "post", "patch", "delete")
    ordering_fields = ("published",)
    ordering = "published"

    def decode_unique_id(self, encoded_data):
        decoded_data = base64.urlsafe_b64decode(encoded_data).decode()
        key = 0x5F
        decrypted_data = "".join(chr(ord(char) ^ key) for char in decoded_data)
        return decrypted_data

    def get_object(self):
        try:
            if article_id := self.kwargs.get("pk"):
                article_id = self.decode_unique_id(article_id)
                article_id = int(article_id.split(":")[0])
                return self.queryset.get(id=article_id)
            return super().get_object()
        except Exception as _:
            raise Http404

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return RetriveArticleSerializer

        if self.action in ("create",):
            return CreateArticleSerializer

        if self.action == "partial_update":
            return UpdateArticleSerializer


class CategoryViewSet(BaseModelViewSet):
    queryset = Category.objects.all()
    permission_classes = (AdminOrStaffCanModify,)
    pagination_class = CategoryPagination
    filterset_class = CategoryFilter
    filter_backends = (filters.DjangoFilterBackend,)
    http_method_names = ("get", "post", "patch", "delete")

    def get_serializer_class(self):
        if self.action in ("list", "retrieve", "partial_update"):
            return RetrieveCategorySerializer

        if self.action in ("create",):
            return CreateCategorySerializer


class UserViewSet(BaseModelViewSet):
    queryset = User.objects.all()
    permission_classes = (IsReadOrCreateAllowed,)
    pagination_class = UserPagination
    http_method_names = ("get", "post", "patch", "delete")

    def get_serializer_class(self):
        if self.action in ("list", "retrieve"):
            return RetriveUserSerializer

        if self.action in ("create",):
            return CreateUserSerializer

        if self.action == "partial_update":
            return UpdateUserSerializer

        if self.action == "resume":
            return ResumeSerializer

    def get_object(self):
        if self.action == "resume":
            user_id = self.kwargs["pk"]
            try:
                resume = Resume.objects.get(user=user_id)
                return resume
            except Resume.DoesNotExist:
                raise Http404

        return super().get_object()

    @extend_schema(tags=["Resume"])
    @action(detail=True, methods=["get", "patch"])
    def resume(self, request, pk=None):
        resume = self.get_object()

        if request.method == "GET":
            serializer = ResumeSerializer(resume)
            return Response(serializer.data)

        elif request.method == "PATCH":
            serializer = ResumeSerializer(resume, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            self.perform_update(serializer)
            return Response(serializer.data)


class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer
