from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate

from rest_framework import serializers
from rest_framework.exceptions import NotFound, ParseError, AuthenticationFailed
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from blog.account.models import User, Profile
from blog.article.models import Article, Category
from blog.api.storage_service import S3Uploader
from blog.api.validators import MediaFileValidatorMixin


class RetrieveCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class CreateCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"

    def to_internal_value(self, data):
        if not data.get("name"):
            raise ParseError({"error": "Required name parameter missing"})

        slug = data.get("slug") if data.get("slug") else data.get("name")
        if Category.objects.filter(slug=slug).exists():
            raise ParseError({
                "error": f"A category with the slug '{slug}' already exists"
            })

        return super().to_internal_value(data)


class RetriveArticleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Article
        exclude = ("status",)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["view_cnt"] = instance.view_cnt
        ret["id"] = instance.generate_unique_id()
        return ret


class CreateArticleSerializer(serializers.ModelSerializer, MediaFileValidatorMixin):
    class Meta:
        model = Article
        exclude = ("updated", "created")
        read_only_fields = (
            "id",
            "author",
            "created",
            "published",
            "updated",
            "slug",
            "view_cnt",
        )

    def to_internal_value(self, data):
        required_fields = ("title", "body", "categories")
        for field in required_fields:
            if not data.get(field):
                raise ParseError({"error": f"Required {field} parameter missing."})

        author_id = data.get("author")
        if author_id and not User.objects.filter(id=author_id).exists():
            raise NotFound({"error": "Author user does not exist"})

        for category in data.getlist("categories"):
            try:
                Category.objects.get(id=category)
            except ObjectDoesNotExist:
                raise NotFound({"error": f"Category [{category}] not found"})

        if data.get("cover"):
            return data

        return super().to_internal_value(data)

    def validate(self, attrs):
        if cover := attrs.get("cover"):
            self.validate_content(cover)
        return attrs

    def create(self, validated_data):
        # TODO: User celery to handel the s3 uplaod
        validated_data["author"] = self.context["request"].user
        if cover := validated_data.get("cover"):
            s3 = S3Uploader(bucket_name="cover")
            file_link = s3.upload_file(cover[0].file, cover[0]._name)
            validated_data["cover"] = file_link

        return super().create(validated_data)

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret["view_cnt"] = instance.view_cnt
        ret["id"] = instance.generate_unique_id()
        return ret


class UpdateArticleSerializer(serializers.ModelSerializer, MediaFileValidatorMixin):
    class Meta:
        model = Article
        exclude = ("created", "updated")
        read_only_fields = ("id", "slug", "created", "updated", "published")

    def to_internal_value(self, data):
        user = self.context["request"].user
        if user.is_staff:
            author_id = data.get("author")
            if author_id and not User.objects.filter(id=author_id).exists():
                raise NotFound({"error": "Author user does not exist"})

            for category in data.get("categories", []):
                try:
                    Category.objects.get(id=category)
                except ObjectDoesNotExist:
                    raise NotFound({"error": f"Category [{category}] not found"})

        if status := data.get("status"):
            status = data["status"] = status.lower()
            if status not in Article.StatusChoices.values:
                raise NotFound({"error": f"Invalid status: {status}"})

        if is_commentable := data.get("is_commentable"):
            if not isinstance(is_commentable, bool):
                raise ParseError({"error": "'is_commentable' must be a boolean"})

        if data.get("cover"):
            return data

        return super().to_internal_value(data)

    def validate(self, attrs):
        user = self.context["request"].user
        denay_fields = ("tag", "view_cnt", "author", "categories")
        for field in denay_fields:
            if attrs.get(field) and not user.is_staff:
                raise ParseError(
                    {"error": f"Permission denied to update '{field}' field"}, code=403
                )
        if cover := attrs.get("cover"):
            self.validate_content(cover)

        return attrs

    def update(self, instance, validated_data):
        # TODO: User celery to handel the s3 uplaod
        if cover := validated_data.get("cover"):
            s3 = S3Uploader(bucket_name="cover")
            if url := instance.cover:
                file_name = url.split("/")[-1]
                s3.delete_file(file_name)

            file_link = s3.upload_file(cover[0].file, cover[0]._name)
            validated_data["cover"] = file_link

        return super().update(instance, validated_data)


class RetriveUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "is_active",
            "phone_number",
        )
        read_only_fields = ("id",)


class CreateUserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(max_length=255, write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "password",
            "confirm_password",
        )
        read_only_fields = ("id",)
        extra_kwargs = {"password": {"write_only": True}}

    def to_internal_value(self, data):
        if User.objects.filter(email=data.get("email")).exists():
            raise ParseError({"error": "email already taken"})

        return super().to_internal_value(data)

    def validate(self, data):
        if not data.get("password") or not data.get("confirm_password"):
            raise ParseError(
                {"error": "Please fill password and confirm password"}, code=400
            )

        if data.get("password", None) != data.get("confirm_password", None):
            raise ParseError({"error": "Password miss match"})

        return data

    def create(self, validated_data):
        validated_data.pop("confirm_password")
        user = User.objects.create_user(**validated_data)
        return user


class UpdateUserSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(max_length=255, write_only=True)
    password = serializers.CharField(max_length=255, write_only=True)

    class Meta:
        model = User
        fields = (
            "id",
            "first_name",
            "last_name",
            "username",
            "email",
            "is_active",
            "phone_number",
            "password",
            "confirm_password",
        )
        read_only_fields = ("id",)

    def validate(self, attrs):
        user = self.context["request"].user
        if attrs.get("password"):
            if not attrs.get("confirm_password"):
                raise ParseError({"error": "Please fill the 'confirm_password'"})

            if attrs.get("password", None) != attrs.get("confirm_password", None):
                raise ParseError({"error": "Password miss match"})

        denied_fields = ["email", "is_active"]
        for field in denied_fields:
            if attrs.get(field) and not user.is_staff:
                raise ParseError({
                    "error": "Permission denied to update '{field}' field"
                })

        return attrs

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            if attr == "password":
                instance.set_password(value)
            else:
                setattr(instance, attr, value)
        instance.save()
        return instance


class ProfileSerializer(serializers.ModelSerializer, MediaFileValidatorMixin):
    class Meta:
        model = Profile
        fields = "__all__"
        read_only_fields = ("id", "user")

    def to_internal_value(self, data):
        if data.get("avatar"):
            return data
        return super().to_internal_value(data)

    def validate(self, attrs):
        if avatar := attrs.get("avatar"):
            self.validate_content(avatar)
        return attrs

    def update(self, instance, validated_data):
        # TODO: User celery to handel the s3 uplaod
        if avatar := validated_data.get("avatar"):
            s3 = S3Uploader(bucket_name="avatar")
            if url := instance.avatar:
                file_name = url.split("/")[-1]
                s3.delete_file(file_name)

            file_link = s3.upload_file(avatar[0].file, avatar[0]._name)
            validated_data["avatar"] = file_link

        return super().update(instance, validated_data)


class LoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        username_field = User.USERNAME_FIELD
        user = User.objects.filter(email=attrs[username_field]).first()
        if not user:
            raise AuthenticationFailed({"error": "Invalid credentials"})

        if not user.is_active:
            raise AuthenticationFailed({"error": "user is not active"})

        authenticate_kwargs = {
            username_field: attrs[username_field],
            "password": attrs["password"],
        }
        user = authenticate(**authenticate_kwargs)
        if not user:
            raise AuthenticationFailed({"error": "Invalid credentials"})

        return super().validate(attrs)
