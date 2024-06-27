import boto3

from django.conf import settings
from botocore.exceptions import NoCredentialsError


class S3Uploader:
    def __init__(self, bucket_name):
        self.bucket_name = bucket_name
        self.s3_client = boto3.client(
            "s3",
            endpoint_url=settings.ARVAN_ENDPOINT,
            aws_access_key_id=settings.ARVAN_ACCESS_KEY,
            aws_secret_access_key=settings.ARVAN_SECRET_KEY,
        )

    def delete_file(self, file_name):
        response = self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_name)
        return response

    def upload_file(self, file_obj, file_name):
        try:
            self.s3_client.upload_fileobj(
                file_obj, self.bucket_name, file_name, ExtraArgs={"ACL": "public-read"}
            )
            file_link = f"{settings.ARVAN_ENDPOINT}/{self.bucket_name}/{file_name}"
            return file_link
        except NoCredentialsError:
            return "Credentials not available."
