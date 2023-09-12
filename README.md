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
Go to backend

```
cd backend
```

run the Django server

```
python3 manage.py runserver
```

and the server would run on port http://127.0.0.1:8000

<i>The CORS policy is dealt by using vite proxy</i>
