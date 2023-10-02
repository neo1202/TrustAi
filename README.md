# TrustAi

TrustAi website

> frontend: React, Tailwind

> backend: Python Django

## To start the Website

### Virtual Environment
Stay in the directory, create `.venv` folder

```
python3 -m venv .venv
```

Activate `.venv`

```
. .venv/bin/activate
```

Check activated Python

```
which python3
```

Upgrade `pip` 

```
pip install --upgrade pip
```

Install packages

```
pip install -r requirements.txt
```

---

### Frontend
Go to frontend and install packages

```
cd frontend
yarn install
```
or `npm install` (whatever works)

Start the frontend...

```
yarn run dev
```

the website runs on http://localhost:5173/

---

### Backend
Open another terminal and go to backend

```
cd backend
```

#### Set up PostgreSQL
Note: MacOS instructions only

Install PostgreSQL and start it
```
brew tap homebrew/services
brew install postgresql
brew services start postgresql
```

Enter Postgresql

```
psql postgres
```

then the terminal will be like:

```
postgres=# blablabla
```

Create New User

- ‘;’ cannot be omitted!
- note the `postgres=#` is the start of the line, no need to type it

```
postgres=# CREATE ROLE username WITH LOGIN PASSWORD 'quoted password';
```

enter `\du` to check if user is created

Add `CREATEDB` Permission to the Users to Allow Them to Create Databases:

```
ALTER ROLE username CREATEDB;
```
then quit by `\q`

Re-enter Postgresql with User Identity

```
psql postgres -U username
```

then the terminal will be like:

```
postgres=> blablabla
```

Under the Identification of this User, Create a Database

```
postgres=> CREATE DATABASE database_name;
```

check database and its user by `\l`




Finally, run the Django server

```
python3 manage.py runserver
```

and the server would run on port http://127.0.0.1:8000

<i>The CORS policy is dealt by using vite proxy</i>
