from django.contrib.auth.models import BaseUserManager
from django.core.exceptions import PermissionDenied

class CustomerManager(BaseUserManager):
    def create_user(self, fName, lName, phoneNum, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Users must have an email address")
        if not phoneNum:
            raise ValueError("Users must have a phone number")
        if not fName or not lName:
            raise ValueError("Users must have a full name")

        email = self.normalize_email(email)
        user = self.model(
            fName=fName,
            lName=lName,
            phoneNum=phoneNum,
            email=email,
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, fName, lName, phoneNum, email, password=None, **extra_fields):
        # Ensure the necessary flags are set for a superuser
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(fName, lName, phoneNum, email, password, **extra_fields)