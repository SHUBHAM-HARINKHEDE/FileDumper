from django.db import models

# Create your models here.
class File(models.Model):
    doc_file = models.FileField(upload_to='User/files')
    doc_size = models.FloatField(blank=True,null=True)
    doc_type = models.CharField(max_length=50,blank=True,null=True)
    
