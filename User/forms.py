from django import forms
from .models import File
from django.forms import ClearableFileInput

class UploadForm(forms.ModelForm):
    
    class Meta:
        model = File
        fields = ("doc_file","doc_size","doc_type",)
        labels = {'doc_file': (''),'doc_size': (''),'doc_type': ('')} 
        widgets = {
            "doc_file" : ClearableFileInput(attrs={'multiple': True})
        }
        
        
