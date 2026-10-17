import os
from django.core.wsgi import get_wsgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'r_corp_support.settings')

application = get_wsgi_application()
