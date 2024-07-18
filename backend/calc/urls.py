from django.urls import path
from. import views
urlpatterns = [
path('welcome', views.welcome, name='welcome'),
path('check_dag', views.check_dag, name='check_dag'),
]