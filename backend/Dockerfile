FROM python:3.12-slim

WORKDIR /app

COPY hospital/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY hospital/ .

CMD ["gunicorn", "hospital.wsgi:application", "--bind", "0.0.0.0:8000"]