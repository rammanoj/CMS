from rest_framework.serializers import ModelSerializer, SerializerMethodField, PrimaryKeyRelatedField
from .models import Brand, Product, Specification, Category


class BrandSerializer(ModelSerializer):

    class Meta:
        model = Brand
        fields = '__all__'


class SpecificationSerializer(ModelSerializer):

    class Meta:
        model = Specification
        fields = ['key', 'value']


class ProductListCreateSerializer(ModelSerializer):

    def to_representation(self, instance):
        data = super(ProductListCreateSerializer, self).to_representation(instance)
        data['brand'] = instance.brand.name
        data['category'] = instance.category.name
        return data

    class Meta:
        model = Product
        fields = ['pk', 'name', 'brand', 'category']


class ProductSerializer(ModelSerializer):
    spec = SerializerMethodField()

    def get_spec(self, obj):
        specs = obj.specification_set.all()
        if specs:
            return SpecificationSerializer(specs, many=True).data
        else:
            return []

    def to_representation(self, instance):
        data = super(ProductSerializer, self).to_representation(instance)
        data['brand'] = instance.brand.name
        data['category'] = instance.category.name
        return data

    class Meta:
        model = Product
        fields = ['pk', 'name', 'brand', 'category', 'spec']


class CategorySerializer(ModelSerializer):

    def to_representation(self, instance):
        data = super(CategorySerializer, self).to_representation(instance)
        if instance.parent is not None:
            data['parent'] = instance.parent.name
        return data

    class Meta:
        model = Category
        fields = ['pk', 'name', 'parent']