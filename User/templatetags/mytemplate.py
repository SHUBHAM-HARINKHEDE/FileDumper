from django import template
from django.http import HttpResponse
from django.template import Context, loader,Template

register = template.Library()

@register.filter(is_safe=True)
def size(value):
    if(value<1024):
        return str(round(value,2))+"B"
    elif(value>=1024 and value<1024**2):
        return str(round(value/1024,2))+"KB"
    elif(value>=1024**2 and value<1024**3):
        return str(round(value/1024**2,2))+"MB"
    else:
        return str(round(value/1024**3,2))+"GB"

@register.filter
def name(value):
    return value.split("/")[2]

@register.filter
def is_type(file,arg):
    try:
        if  arg in file.doc_type:
                return True
    except Exception as e:
        print(e)
        return False

        



