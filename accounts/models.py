from django.db import models
from .managers import CustomerManager
from django.contrib.auth.models import AbstractBaseUser


# Create your models here.
class Customer(AbstractBaseUser):
    """
    Model representing an application user/customer.
    Maps to the Customer entity.
    (Note: In a production app, consider extending Django's AbstractUser for authentication.)
    """

    customerID = models.AutoField(primary_key=True)
    fName = models.CharField(max_length=100)
    lName = models.CharField(max_length=100)
    email = models.EmailField(max_length=255, unique=True)
    phoneNum = models.CharField(max_length=20, unique=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["fName", "lName", "phoneNum"]

    objects = CustomerManager()

    class Meta:
        db_table = "customer"

    def __str__(self):
        return f"{self.fName} {self.lName}"
