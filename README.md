# Setup
All should be done in the project directory.

Setup PostgreSQL with docker
```bash
$ docker compose up
```
Initialize yarn.
Note that it requires Node.js 18.17.0+, otherwise some packages are incompatible and the app will not run.
```bash
$ yarn`
```

Migrate database

```base
$ yarn migrate
```
Create ```.env.local``` at the root directory, there should be
```
POSTGRES_URL="postgres://postgres:postgres@localhost:5432/hw3"
```
To open the application
```bash
$ yarn dev
```

# 進階要求
時間表，加入後可標記時段，再按一次取消選取。
離開後再加入需重新選取。

顏色由淺到深代表參加人數；範圍外時段會顯示灰色。
