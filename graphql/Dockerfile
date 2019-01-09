FROM graphile/postgraphile:latest

EXPOSE 5000

CMD ["postgraphile", "--connection", "postgres://postgres:example@database:5432/governet", "--schema public --watch"]
