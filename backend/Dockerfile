FROM python:3.9

ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

RUN apt-get update
RUN pip install --upgrade pip

WORKDIR /app

COPY ../requirements.txt  /app/
RUN pip install -r requirements.txt

COPY . /app/
EXPOSE 8000

# Run your Django application (adjust this command as needed)
# CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]

