## API

### main route: /user/admin

To get all admins: GET /
  - need an authenticated admin to perform it

To get an admin: GET /me
  - need an authenticated admin to perform it

To add a new admin: POST /signup

To login as an admin: POST /login

To edit an admin: PATCH /me
  - need an authenticated admin to perform it

To delete an admin: DELTE /me
  - need an authenticated admin to perform it

To logout from a device: POST /logout
  - need an authenticated admin to perform it

To logout from all devices: POST /logout-all
  - need an authenticated admin to perform it



### main route: /user/client

To get all users: GET /
  - need an authenticated admin to perform it

To get an user: GET /:id
  - need an authenticated admin to perform it

To edit an user: PATCH /:id
  - need an authenticated admin to perform it

To delete an user: DELETE /:id
  - need an authenticated admin to perform it

To get an user: GET /me
  - need an authenticated user to perform it
  
To edit an user: PATCH /me
  - need an authenticated user to perform it

To delete an user: DELTE /me
  - need an authenticated user to perform it

To add a new user: POST /signup

To login as an user: POST /login

To logout from a device: POST /logout
  - need an authenticated user to perform it

To logout from all devices: POST /logout-all
  - need an authenticated user to perform it

To add infected patient: PATCH /infected/:id
  - need an authenticated admin to perform it


### main route: /news

To get all news: GET /

To get a news: GET /:id

To add a new news: POST /

To edit news: PATCH /:id

To delete news: DELTE /:id


### main route: /advice

To get all advices: GET /

To get an advice: GET /:id

To add a new advice: POST /

To edit an advice: PATCH /:id

To delete an advice: DELTE /:id

### main route: /user/client/notification

To get an notification: GET /:id
  - need an authenticated user to perform it

To add a new notification: POST /
  - need an authenticated user to perform it

### for forget password : POST /user/client/password/forget
 - write an email to send verification code to your email

 ### write the email and verification code : POST /user/client/password/code/verification

 -write your email and the verification code

 ### change password : POST /user/client/password/reset

 -write email and password and confirm password