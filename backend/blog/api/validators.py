from rest_framework.exceptions import ParseError


class MediaFileValidatorMixin:
    MIN_SIZE_BYTES = 5 * 1024  # 5 KB
    MAX_SIZE_BYTES = 5 * 1024 * 1024  # 5 MB

    def validate_content(self, content):
        if not hasattr(content, "content_type") or not hasattr(content, "size"):
            raise ParseError(
                {"error": "Input file must be a file-like byte object"}, code=400
            )

        if content.content_type not in ("image/jpeg", "image/jpg", "image/png"):
            raise ParseError(
                {"error": "Only JPG and PNG formats are accepted for the file"},
                code=400,
            )

        if not (self.MIN_SIZE_BYTES <= content.size <= self.MAX_SIZE_BYTES):
            raise ParseError(
                {"error": "File size must be between 5 KB and 5 MB"}, code=400
            )

        return content
