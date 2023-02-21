FROM nginx/unit:1.23.0-python3.9

WORKDIR /app
COPY . .

RUN pip install poetry
RUN poetry export > requirements.txt && pip install -r requirements.txt
COPY unit-config.json /docker-entrypoint.d/config.json
