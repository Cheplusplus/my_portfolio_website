from django.shortcuts import render
from django.http import JsonResponse
from main.a_star_pathfinding import update_obstacles, find_shortest_path, setup
from json import loads
from django.template.defaulttags import register
from main.sudoku_generator import generate, toJSONlist

@register.filter
def get_range(value):
    return range(value)

def home(request):
    return render(request, 'home.html')

def pathfinder(request):
    setup()
    return render(request, 'astar.html')

def find_path(request):
    path = find_shortest_path(loads(request.body)[0], loads(request.body)[1])
    if path == 'null':
        return
    return JsonResponse(path,safe=False)

def new_obstacles(request):
    update_obstacles(loads(request.body))
    return render(request, 'astar.html')

def balls(request):
    return render(request, 'balls.html')

def sudoku(request):
    return render(request, 'sudoku.html')

def new_puzzle(request, difficulty, seed):
    while True:
        puzzle, solution = generate(difficulty, seed)
        if isinstance(puzzle, list):
            break
    
    JSONpuzzle = toJSONlist(puzzle)
    solution = toJSONlist(solution)
    JSONpack = [JSONpuzzle, solution]
    return JsonResponse(JSONpack, safe=False)

def instagram(request):
    return render(request, 'instagram.html')

def portfolio(request):
    return render(request, 'portfolio.html')

def profile(request):
    return render(request, 'cv.html')