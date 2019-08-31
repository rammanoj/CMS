from django.db import transaction
from django.db.models import Q
from django.shortcuts import get_object_or_404, redirect
from rest_framework import status
from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from rest_framework.response import Response
from .serializers import BrandSerializer, ProductSerializer, ProductListCreateSerializer, CategorySerializer
from .models import Brand, Product, Specification, Category, Relation


class BrandListCreateAPIView(ListCreateAPIView):
    
    serializer_class = BrandSerializer
    queryset = Brand.objects.all()


class BrandRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = BrandSerializer
    http_method_names = ['patch', 'delete']

    def get_object(self):
        return get_object_or_404(Brand, pk=self.kwargs['pk'])

    def delete(self, request, *args, **kwargs):
        super(BrandRetrieveUpdateDestroyAPIView, self).delete(request, *args, **kwargs)
        return Response({
            'message': 'Successfully deleted the brand',
            'error': 0
        }, status=status.HTTP_200_OK)


class ProductListCreateView(ListCreateAPIView):
    serializer_class = ProductListCreateSerializer
    queryset = Product.objects.all()

    def get(self, request, *args, **kwargs):
        if not request.session.get('category', None) is None:
            self.queryset = Product.objects.filter(category__name=request.session['category'])
            del request.session['category']

        brand = request.GET.get('brand', None)
        category, categories, tree = request.GET.get('category', None), [], []
        if category is not None:
            categories = list(Relation.objects.filter(category__name=category).values_list('child__pk', flat=True))
            categories.append(get_object_or_404(Category, name=category).pk)
            tree = []
            parent_exist = get_object_or_404(Category, name=category)
            while parent_exist:
                tree.append(parent_exist.name)
                parent_exist = parent_exist.parent

        queryset = self.queryset
        if brand is not None:
            queryset = Product.objects.filter(brand__name=brand)

        if category is not None:
            queryset = queryset.filter(category__pk__in=categories)

        search = request.GET.get('search', None)

        if search is not None:
            queryset = queryset.filter(name__icontains=search)

        self.queryset = queryset

        context = super(ProductListCreateView, self).get(request, *args, **kwargs)
        if len(tree) != 0:
            context.data['categories'] = tree
        return context

    def post(self, request, *args, **kwargs):
        if "brand" not in request.data or \
                "category" not in request.data or \
                dict(request.data)['brand'] in ['', ['']] or dict(request.data)['category'] in ['', ['']]:
            return Response({'message': 'Fill form completely', 'error': 1}, status=status.HTTP_400_BAD_REQUEST)
        try:
            with transaction.atomic():
                # Create the product
                request.data._mutable = True
                request.data['brand'] = get_object_or_404(Brand, name=request.data['brand']).pk
                request.data['category'] = get_object_or_404(Category, name=request.data['category']).pk
                request.data._mutable = False

                context = super(ProductListCreateView, self).post(request, *args, **kwargs)
                product = get_object_or_404(Product, pk=context.data['pk'])
                data = dict(request.data)
                if "spec[][key]" in data and "spec[][value]" in data:
                    out, key, value = [], data['spec[][key]'], data['spec[][value]']
                    if len(key) != len(value):
                        raise InterruptedError
                    for i in range(0, len(key)):

                        if not (key[i] and value[i]):
                            continue

                        obj = {
                            "key": key[i],
                            "value": value[i],
                            "product": product
                        }
                        data = Specification.objects.create(**obj)
                        out.append({"key": data.key, "value": data.value})
                    context.data['spec'] = out
                else:
                    context.data['spec'] = []
        except InterruptedError:
            return Response({
                'message': 'Enter all key and value pairs',
                'error': 1
            }, status=status.HTTP_400_BAD_REQUEST)
        return context


class ProductRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = ProductSerializer
    http_method_names = ['get', 'patch', 'delete']

    def get_object(self):
        return get_object_or_404(Product, pk=self.kwargs['pk'])

    def patch(self, request, *args, **kwargs):
        try:
            with transaction.atomic():
                request.data._mutable = True
                request.data['brand'] = get_object_or_404(Brand, name=request.data['brand']).pk
                request.data['category'] = get_object_or_404(Category, name=request.data['category']).pk
                request.data._mutable = False

                context = super(ProductRetrieveUpdateDestroyAPIView, self).patch(request, *args, **kwargs)
                data = dict(request.data)
                if "spec[][key]" in data and "spec[][value]" in data:
                    self.get_object().specification_set.all().delete()
                    out, key, value = [], data['spec[][key]'], data['spec[][value]']
                    if len(key) != len(value):
                        raise InterruptedError
                    for i in range(0, len(key)):

                        if not (key[i] and value[i]):
                            continue

                        obj = {
                            "key": key[i],
                            "value": value[i],
                            "product": self.get_object()
                        }
                        data = Specification.objects.create(**obj)
                        out.append({"key": data.key, "value": data.value})
        except InterruptedError:
            return Response({
                'message': 'Enter key and value pair details properly',
                'error': 1
            }, status=status.HTTP_400_BAD_REQUEST)
        return context

    def delete(self, request, *args, **kwargs):
        super(ProductRetrieveUpdateDestroyAPIView, self).delete(request, *args, **kwargs)
        return Response({
            'message': 'Successfully deleted the product',
            'error': 0
        })


class CategoryListCreateAPIView(ListCreateAPIView):
    serializer_class = CategorySerializer

    def get_queryset(self):
        data = self.request.GET
        if "name" in data:
            if data['name'] == '':
                data = None
            else:
                data = data['name']
            data = Category.objects.filter(parent__name=data)
            return data
        return Category.objects.all()

    def get(self, request, *args, **kwargs):
        if self.get_queryset():
            return super(CategoryListCreateAPIView, self).get(request, *args, **kwargs)
        else:
            request.session['category'] = self.request.GET.get('name', None)
            return redirect('product-create')

    def post(self, request, *args, **kwargs):
        with transaction.atomic():
            # Create the Category
            request.data['parent'] = get_object_or_404(Category, name=request.data['parent']).pk
            context = super(CategoryListCreateAPIView, self).post(request, *args, **kwargs)
            parent_exist = Category.objects.filter(name=context.data['parent'])
            if parent_exist.exists():
                parent_exist = parent_exist[0]
            child = get_object_or_404(Category, pk=context.data['pk'])
            while parent_exist:
                Relation.objects.create(category=parent_exist, child=child)
                parent_exist = parent_exist.parent
        return context


class CategoryRetrieveUpdateDestroyAPIView(RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    http_method_names = ['patch', 'delete']

    def get_object(self):
        return get_object_or_404(Category, name=self.kwargs['name'])

    def patch(self, request, *args, **kwargs):
        parent = self.get_object().parent.name
        with transaction.atomic():
            request.data['parent'] = get_object_or_404(Category, name=request.data['parent']).pk
            context = super(CategoryRetrieveUpdateDestroyAPIView, self).patch(request, *args, **kwargs)
            if parent != context.data['parent']:
                # Update 'Relation' table
                parent_exist = get_object_or_404(Category, name=parent)
                while parent_exist:
                    temp = parent_exist
                    parent_exist = parent_exist.parent
                    Relation.objects.filter(Q(category=temp), Q(child=self.get_object())).delete()

                parent_exist = self.get_object().parent
                while parent_exist:
                    Relation.objects.create(category=parent_exist, child=self.get_object())
                    parent_exist = parent_exist.parent

        return context

    def delete(self, request, *args, **kwargs):
        super(CategoryRetrieveUpdateDestroyAPIView, self).delete(request, *args, **kwargs)
        return Response({
            'message': 'Successfully deleted the Category',
            'error': 0
        })

