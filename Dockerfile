FROM python:3.12

WORKDIR /app

COPY . /app

RUN apt-get update && apt-get install -y nodejs npm

RUN pip install -r requirements.txt

RUN cd frontend && npm install && npm run build

EXPOSE 7860

CMD ["python", "backend/app.py"]