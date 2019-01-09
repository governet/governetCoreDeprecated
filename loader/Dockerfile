FROM python:3.7.0-stretch

RUN pip install flask configparser psycopg2

RUN pip install psycopg2-binary

RUN mkdir /srv/data

RUN mkdir /var/log/loader && touch /var/log/loader/loader.log

RUN mkdir /opt/governetLoader

WORKDIR /opt/governetLoader

COPY . .

EXPOSE 5000

CMD ["python", "/opt/governetLoader/startup.py", "loader.conf", "DEFAULT"]
