# BOWEN ANALYTICS BACKEND

## API Documentation:
### Signup:
- url: ```/signup```
- params: ``` { name: String, email: String, ContactNo: String, password: String } ```
- require: Csrf

### Signin:
- url: ```/signin```
- params: ```{ email: String, password: String }```
- require: Login, Csrf

### Logout:
- url: ```/logout```
- params: None
- require: Login

### Error Report:
- url: ```/error-report```
- params: ```{data: {message: string, caller: string, loglever: Number[0-5] }}```
- require: Csrf-Token.
