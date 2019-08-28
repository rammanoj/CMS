from django.db import transaction
from django.shortcuts import get_object_or_404
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from .serializers import BrandSerializer, ProductSerializer
from .models import Brand, Product


class BrandListCreateAPIView(ListCreateAPIView):
    serializer_class = BrandSerializer
    queryset = Brand.objects.all()


class BrandRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = BrandSerializer
    http_method_names = ['get', 'patch', 'delete']

    def get_queryset(self):
        return get_object_or_404(Brand, pk=self.kwargs['pk'])


class ProductListCreateView(ListCreateAPIView):
    serializer_class = ProductSerializer
    queryset = Product.objects.all()

    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            # Create the product
            data = request.data.copy()
            del request.data['specifications']
            context = super(ProductListCreateView, self).post(request, *args, **kwargs)



class ProductRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    http_method_names = ['get', 'patch', 'delete']

    def get_queryset(self):
        return get_object_or_404(Product, pk=self.kwargs['pk'])

