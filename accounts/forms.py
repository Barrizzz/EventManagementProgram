from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django import forms
from .models import Customer


class CustomerRegistrationForm(UserCreationForm):
    # We add the extra fields from our model
    is_staff = forms.BooleanField(
        required=False,
        initial=False,
        widget=forms.CheckboxInput(attrs={"class": "form-check-input"}),
    )

    class Meta:
        # Using UserCreationForm's Meta but pointing to your model
        model = Customer
        fields = ("fName", "lName", "email", "phoneNum", "is_staff")

    def clean_email(self):
        # Good practice: Normalize the email in the form layer too
        return self.cleaned_data.get("email").lower()


class CustomerLoginForm(AuthenticationForm):
    username = forms.EmailField(
        label="Email",
        widget=forms.EmailInput(
            attrs={"class": "form-control", "placeholder": "Your Email"}
        ),
    )
    password = forms.CharField(
        label="Password",
        widget=forms.PasswordInput(
            attrs={"class": "form-control", "placeholder": "Password"}
        ),
    )
