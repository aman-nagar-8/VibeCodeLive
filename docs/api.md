### POST /login/register

Description:
Creates a new user

Request Body:
{
"name":"aman",
"email":"aman@gmail.com",
"password":"something"
}

Response:
{
"message": "Confirm your email"
}

### POST /login

Description:
Login User

Request Body:
{
  "email":"aman@gmail.com",
  "password":"something"
}

Response:
{
    status: 200,
    message: "Login successful",
    accessToken,
    user: {
       id: user._id,
       name: user.name,
       email: user.email,
    },
    success: true,
}

### POST /login/refresh

Description:
Refresh access token

Request Body:
{},
refreshToken: in cookies

Response:
{
  accessToken: newAccessToken,
}

### POST /getUser

Description:
Return info about User

Request Body:
{},
authHeader: authorization `ACCESS TOKEN`

Response:
{
  "user": "user"
}

### POST /createmeeting

Description:
Create a new meeting

Request Body:
{
  name: meeting_name, 
  url: meeting_url,
  joinPolicy: ["AUTH_ONLY", "GUEST_ONLY", "BOTH"],
  status: ["scheduled", "live", "ended"],
  requiredFields : []
},
authHeader: authorization `ACCESS TOKEN`

Response:
{
    message: "Meeting created successfully",
    meeting,
    socketAuth,
    success: true,
}

### POST /getmeeting

Description:
Creates a new session for teacher

Request Body:
{
  "meetingId": "123"
}

Response:
{
  "meeting": "meeting",
  "member": "member",
}

### POST /joinmeeting

Description:
Creates a new session for teacher

Request Body:
{
  "meetingId": "123"
},
authHeader: authorization `ACCESS TOKEN`

Response:
{
      success: true,
      socketAuth,
      message: "User added to meeting",
      status: 200,
}

### POST /meeting/getCurrentMeeting

Description:
Return meeting by meeting name or url

Request Body:
{
  "query": "meeting_name",
}

Response:
{
        success: true,
        message: "Meetings fetched successfully",
        result: meetings,
}

### POST /run

Description:
Give output of a source code

Request Body:
{
  code: {...},
  language_id: 12,
  input: [],
}

Response:
{
        source_code: code,
        language_id,
        stdin: input,
}
