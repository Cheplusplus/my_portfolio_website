from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('pathfinder/', views.pathfinder, name='pathfinder'),
    path('astar/', views.find_path, name='astar'),
    path('update-obstacles/', views.new_obstacles, name='update-obstacles'),
    path('balls/', views.balls, name='balls'),
    path('sudoku/', views.sudoku, name='sudoku'),
    path('instagram/', views.instagram, name='instagram'),
    path('new_puzzle/<int:difficulty>/<int:seed>/', views.new_puzzle, name='new_puzzle'),
    path('portfolio/', views.portfolio, name='portfolio'),
    path('profile/', views.profile, name='profile'),
]