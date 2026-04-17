## What is thi project
A platfrom that work as a interface between student and teacher and monitor student behavior in real time using AI.

## Features
- Live coding session
- Student activity traking and suggestion
- student summery for teacher
- AI based evaluation

## Tech Stack
- Next.js
- MongoDB
- Redux
- Socket.io

## Setup Instructions
git clone https://github.com/aman-nagar-8/VibeCodeLive.git
cd VibeCodeLive
npm install
npm run dev

## Start Socket Server
cd socket
npm run start

## Folder Structure 
VibeCodeLive
├── app/
    ├── api/
        ├── auth/
        ├── createmeeting/
        ├── getmeeting/
        ├── getUser/
        ├── joinmeeting/
        ├── login/
            ├── refresh/
            ├── register/
            ├── verify-email/
        ├── meeting/
            ├── getCurrentMeeting/
        ├── run/
    ├── login/
        ├── register/
            ├── VerifyEmail/
    ├── meeting/
        ├── admin/
        ├── create/
        ├── join/
        ├── member/
├── components/
    ├── admin/
    ├── home/
    ├── joinMeeting/
    ├── Member/
├── lib/
├── models/
├── store/
├── utils/

## Socket Folder Structure
Socket
├── src/
    ├── socket/
├── server/

## Data Flow 

1. Teacher creates a session
2. Student joins session
3. Student writes code
4. Events are captured (typing, paste, errors)
5. Backend processes data
6. AI generates score
7. Teacher dashboard displays results

