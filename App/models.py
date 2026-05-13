from django.db import models
from django.db.models import Q

def music_list(request):
    query = request.GET.get('q')

    songs = Song.objects.all()

    if query:
        songs = songs.filter(
            Q(name__icontains=query) |
            Q(artist__icontains=query)
        )

    return render(request, 'music_list.html', {
        'songs': songs
    })


# Create your models here.
class Song(models.Model):
    title= models.TextField()
    artist= models.TextField()
    image= models.ImageField()
    audio_file = models.FileField(blank=True,null=True)
    audio_link = models.CharField(max_length=200,blank=True,null=True)
    lyrics=models.TextField(blank=True,null=True)
    duration=models.CharField(max_length=20)
    paginate_by = 2

    def __str__(self):
        return self.title