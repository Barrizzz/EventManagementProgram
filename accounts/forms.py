# Assuming this is in your 'app_name/forms.py'

from django import forms
from django.contrib.auth.forms import AuthenticationForm
from .models import Customer


# --- 1. Registration Form ---
# Use the built-in UserCreationForm as a base for handling password hashing correctly
class CustomerRegistrationForm(forms.ModelForm):
    # Add password fields explicitly
    password = forms.CharField(widget=forms.PasswordInput)
    password2 = forms.CharField(label="Confirm Password", widget=forms.PasswordInput)

    class Meta:
        model = Customer
        # Include all required fields from the model
        fields = ("fName", "lName", "email", "phoneNum")

    def clean(self):
        # Ensure passwords match
        cleaned_data = super().clean()
        password = cleaned_data.get("password")
        password2 = cleaned_data.get("password2")

        if password and password2 and password != password2:
            raise forms.ValidationError("Passwords must match.")
        return cleaned_data

    def save(self, commit=True):
        # Create the user and set the hashed password correctly
        user = super().save(commit=False)
        user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user


# --- 2. Login Form ---
# Since you set USERNAME_FIELD = 'email', we need a form that accepts 'email' instead of 'username'
class CustomerLoginForm(AuthenticationForm):
    # Change the default 'username' field label to 'Email'
    username = forms.CharField(label="Email", max_length=254)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Change the input placeholder for better UX (Optional)
        self.fields["username"].widget.attrs.update({"placeholder": "Your Email"})
