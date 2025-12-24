"use client"
import React from 'react'
import { useSearchParams } from 'next/navigation';

const page = () => {
  const searchParams = useSearchParams();
  const meetingId = searchParams.get('meeting');
  const token = searchParams.get('token');
  return (
    <div className='' >
      <div>meetingID: {meetingId}</div>
      <div>token: {token}</div>
    </div>
  )
}

export default page
