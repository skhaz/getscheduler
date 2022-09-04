FROM python:3.10-slim AS base

ENV PATH /opt/venv/bin:$PATH
ENV PYTHONUNBUFFERED 1
ENV PYTHONDONTWRITEBYTECODE True

FROM base AS builder
WORKDIR /opt
RUN apt-get update && apt-get install -y build-essential libcurl4-openssl-dev libssl-dev
RUN python -m venv venv
COPY requirements.txt .
RUN pip install --requirement requirements.txt

FROM base
WORKDIR /app
RUN apt-get update && apt-get install -y libcurl4
COPY --from=builder /opt/venv /opt/venv
COPY main.py .

ARG PORT=8000
ENV PORT $PORT
EXPOSE $PORT

CMD exec gunicorn --bind :$PORT --workers 1 --threads 8 --timeout 0 main:app