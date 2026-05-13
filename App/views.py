from django.shortcuts import render
from .models import Song
from django.core.paginator import Paginator

def index(request):
    query = request.GET.get('q')
    
    songs = Song.objects.all().order_by('id')

    # SEARCH FILTER
    if query:
        songs = songs.filter(title__icontains=query)

    # PAGINATION (VERY IMPORTANT)
    paginator = Paginator(songs, 1)  # show 5 songs per page
    page_number = request.GET.get('page')
    page_obj = paginator.get_page(page_number)

    return render(request, 'index.html', {
        'page_obj': page_obj,
        'query': query
    })