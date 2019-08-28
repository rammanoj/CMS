from django.db import models


class Brand(models.Model):
    name = models.CharField(unique=True, max_length=100)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=100)
    parent = models.ForeignKey('self', on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Relation(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='category_parent')
    child = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='category_child')

    def __str__(self):
        return self.category.__str__() + "--" + self.category.__str__()


class Product(models.Model):
    name = models.CharField(unique=True, max_length=100)
    brand = models.ForeignKey(Brand, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


class Specification(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    key = models.CharField(max_length=50)
    value = models.CharField(max_length=50)

    def __str__(self):
        return str(self.pk) + "--" + self.product.__str__()