from django.urls import path
from .views import BrandListCreateAPIView, BrandRetrieveUpdateDestroyAPIView,\
    ProductListCreateView, ProductRetrieveUpdateDestroyAPIView, \
    CategoryListCreateAPIView, CategoryRetrieveUpdateDestroyAPIView


urlpatterns = [

    # Brand Urls
    path('brand/add/', BrandListCreateAPIView.as_view(), name='brand-create'),
    path('brand/<int:pk>/', BrandRetrieveUpdateDestroyAPIView.as_view(), name='brand-update'),

    # Product Urls
    path('add/', ProductListCreateView.as_view(), name='product-create'),
    path('<int:pk>/', ProductRetrieveUpdateDestroyAPIView.as_view(), name='product-update'),

    # Category Urls
    path('category/add/', CategoryListCreateAPIView.as_view(), name='category-create'),
    path('category/<name>/', CategoryRetrieveUpdateDestroyAPIView.as_view(), name='category-update'),

]