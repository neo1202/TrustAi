# TAI DQ website

> frontend: React, Tailwind

> backend: Django Postgres

Integrated backend with Docker for containerization.

## Project Overview
本專題聚焦於資料品質 (DQ) 及可解釋 AI (XAI) 兩大主題，致力於建立自動化流程，降低資料處理成本同時提升可靠度。

#### 資料品質 (DQ)
在資料品質方面，透過母數及無母數補值等補值方法提升資料可用性，並以 Differential Entropy & Canonical Relative Entropy、相關性等指標評估補值成果。
#### 可解釋 AI (XAI)
可解釋 AI 透過 Active Learning 與使用者互動，適應各種客製化資料和需求；結合 Knowledge Distillation 確保主動學習過程的穩定性和降低最終參數量；最後透過 SHAP 評估模型的可解釋性以及 Counterfactual Explanation 協助使用者根據模型結果做進一步決策。這些模組的結合旨在建立全面的資料處理流程，確保模型的可靠性和解釋性，以提升整體效能。

#### Know More: [Presentation PPT](./專題簡報.pdf) 
#### [Poster](./Poster.pdf)

## Demo 
#### Demo Video
https://drive.google.com/file/d/155tX3hSLL8DmC_Ts90cfWRs3gXJXQyK7/view

#### Website Preview
![ Upload Page Screenshot](./image/upload_page.png)



## To start the website

### Frontend:

<i>the website runs on</i> http://localhost:5173/

```
cd frontend
npm install
npm run dev
```

### Backend&DB:

- open your docker desktop (download from https://www.docker.com/products/docker-desktop/)
- need to add the tag --build to build an image for the first time

```
cd backend
docker compose up --build
```

<!-- # TrustAi

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

##### Names for user, password, db, etc.
- Host: `127.0.0.1` or `localhost`
- Port: `5432`
- User: `ntuimproject`
- Password: `ntuim`
- Database Name: `ntuimprojectdatabase`

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

#### Download PgAdmin4
link: https://www.pgadmin.org/download/

and refer to this page for creating a database
https://www.codementor.io/@engineerapart/getting-started-with-postgresql-on-mac-osx-are8jcopb


Finally, run the Django server

```
python3 manage.py runserver
```

and the server would run on port http://127.0.0.1:8000

<i>The CORS policy is dealt by using vite proxy</i> -->
