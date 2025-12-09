from django.contrib.auth.models import BaseUserManager

class CustomerManager(BaseUserManager):
        def create_user(self, fName, lName, phoneNo, email, password=None):
            if not email:
                raise ValueError("Users must have an email address")
            
            if not phoneNo:
                raise ValueError("Users must have a phone number")
            
            if not fName and not lName:
                raise ValueError("Users must have a name")
            

            user = self.model(
                fName=fName,
                lName=lName,
                phoneNum=phoneNo,
                email=self.normalize_email(email),
            )
            user.set_password(password)
            user.save(using=self._db)
            return user
        
        def create_superuser(self, fName, lName, phoneNo, email, password):
            user = self.create_user(
                fName=fName,
                lName=lName,
                phoneNo=phoneNo,
                email=email,
                password=password,
            )
            user.is_admin = True
            user.save(using=self._db)
            return user