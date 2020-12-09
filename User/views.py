from django.shortcuts import render
from User.models import File
from django.http import JsonResponse
from .forms import UploadForm
import os
# Create your views here.
def index(request):  
    form =UploadForm(request.POST or None,request.FILES or None)
    if request.is_ajax():
        if form.is_valid():
            file_data=form.save()
            data = {'is_valid': True, 'name': file_data.doc_file.name, 'url': file_data.doc_file.url}
            print(data)
            return JsonResponse({'message':'uploaded successfully!'})
        else:
            return JsonResponse({'message':'invalid form!'})
    context={
        'form':form,
    }
    return render(request,'User/index.html',context)

def show(request):
    i_trash=File.objects.filter(doc_type__contains='image')
    v_trash=File.objects.filter(doc_type__contains='video')
    c_trash=File.objects.filter(doc_type__contains='compressed')
    p_trash=File.objects.filter(doc_type__contains='pdf')
    o_trash=File.objects.all()
    o_trash=o_trash.exclude(doc_type__contains='image')
    o_trash=o_trash.exclude(doc_type__contains='video')
    o_trash=o_trash.exclude(doc_type__contains='compressed')
    o_trash=o_trash.exclude(doc_type__contains='pdf')
    #size=[round(os.path.getsize(x.doc_file.path)/1024,2) for x in trash]
    #files=zip(trash,size)
    context={
        'i_trash':i_trash,
        'v_trash':v_trash,
        'c_trash':c_trash,
        'p_trash':p_trash,
        'o_trash':o_trash,
        
    }
    return render(request,'User/junkyard.html',context)


def search(request):
    if request.method =='POST':
        search = str(request.POST.get('search'))
        print("search:",search)
        s_trash=File.objects.filter(doc_file__contains=search)
        print(s_trash)
        context={
            's_trash': s_trash,
        }
        return render(request,'User/search.html',context)
    else:
        trash=File.objects.all()
        context={
            's_trash': trash,
        }
        return render(request,'User/search.html',context)


