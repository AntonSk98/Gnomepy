# Gnomepy
Ticket Management System – a comprehensive one-stop solution for managing all your household and internal requests and issues.

## Introduction
This web application is a viable alternative to well-known services like Freshdesk, offering a self-hosted solution for managing customer inquiries and support requests.

## Features

1. Create tickets with ease using our markdown editor and enjoy the added convenience of file uploads.
2. Markdown-based notebook, featuring convenient to-do lists to help you stay organized and on top of your tasks.
3. Our design is fully responsive, optimized to accommodate various screen sizes ranging from mobile devices all the way up to 4k displays.
4. Skip the burden of complex setups and simply use our readily available Docker image for easy and hassle-free deployment.
5. Our system is built with ease of use in mind, featuring a simple and logical workflow that ensures a seamless experience for users of all levels.

## Local deployment with docker
After deploying this application locally using the provided configuration, you can access it at http://localhost:5000.

```
version: "3.1"

services:
  postgres:
    container_name: postgres
    image: postgres:latest
    restart: always
    volumes:
      - ./gnomepy/db:/data/db
    environment:
      POSTGRES_USER: ansk98
      POSTGRES_PASSWORD: 1234
      POSTGRES_DB: gnomepy

  client:
    container_name: gnomepy
    image: antonsk98/gnomepy:latest
    ports:
      - 5000:5000
    restart: on-failure
    depends_on:
      - postgres
    environment:
      PORT: 5000
      DB_USERNAME: ansk98
      DB_PASSWORD: 1234
      DB_HOST: postgres
      BASE_URL: "http://localhost:5000"
```
## Deploying locally with Nginx
Nginx configuration - gnomepy.conf

After deployment, the application can be accessed locally at gnomepy.de
```
events {
}

http {
        server {
                listen 80;
                listen [::]:80;
                server_name gnomepy.de;
                add_header Strict-Transport-Security "max-age=15552000; includeSubDomains" always;

                location / {
                        proxy_pass http://client:5000;
                        proxy_next_upstream error timeout invalid_header http_500 http_502 http_503;
                        proxy_set_header Host $host;
                        proxy_set_header X-Real-IP $remote_addr;
                        proxy_set_header X-Forward-For $proxy_add_x_forwarded_for;
                        proxy_set_header X-Forwarded-Proto https;
                        proxy_redirect off;
                        proxy_read_timeout 5m;
                }
                client_max_body_size 10M;
        }
}
```
Docker-compose file
```
version: "3.1"

services:
  postgres:
    container_name: postgres
    image: postgres:latest
    restart: always
    volumes:
      - ./gnomepy/db:/data/db
    environment:
      POSTGRES_USER: ansk98
      POSTGRES_PASSWORD: 1234
      POSTGRES_DB: gnomepy


  nginx:
    container_name: nginx
    image: nginx
    ports:
      - "80:80"
    volumes:
      - ./gnomepy.conf:/etc/nginx/nginx.conf:ro
  client:
    container_name: gnomepy
    image: antonsk98/gnomepy:latest
    links:
      - "nginx:gnomepy.de"
    ports:
      - 5000:5000
    restart: on-failure
    depends_on:
      - postgres
      - nginx
    environment:
      PORT: 5000
      DB_USERNAME: ansk98
      DB_PASSWORD: 1234
      DB_HOST: postgres
```
## Motivation
1. Unlock the potential for growth and development by exploring exciting technologies like React and Next.js.
2. Embrace the challenge of learning something new and take your skills to the next level!
2. Finally manage your household requests and to-do tasks, all in one place.
3. Boost my portfolio with practical projects that improve the daily life and make the life easier.

## Application in action
Log in view
![Log in view](assets/log_in.PNG)
Dashboard page
![Dashboard page](assets/dashboard.PNG)
All issues overview
![All issues overview](assets/all_issues.PNG)
New issue modal
![New issue modal](assets/new_issue.PNG)
Notes tab
![Notes tab](assets/notes.PNG)
User management page
![User management page](assets/user_managements.PNG)
Profile settings and management
![Profile settings and management](assets/profile_management.PNG)
##### **Remark:** This project is inspired by [Peppermint](https://github.com/Peppermint-Lab/peppermint). 