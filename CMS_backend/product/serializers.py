from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import Brand, Product


class BrandSerializer(ModelSerializer):

    class Meta:
        model = Brand
        fields = '__all__'


class ProductSerializer(ModelSerializer):
    brand = SerializerMethodField()
    category = SerializerMethodField()

    def get_brand(self, obj):
        return obj.brand.name

    def get_category(self, obj):
        return obj.category.name

    class Meta:
        model = Product
        fields = '__all__'
