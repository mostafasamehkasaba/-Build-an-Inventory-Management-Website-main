import { stackServerApp } from '@/stack/server';

import { redirect } from 'next/navigation';


const GetCurrentuser = async () => {
  const user = await stackServerApp.getUser();
  if (!user) {
    redirect('/sign-up');
  }
  return user;
}

export default GetCurrentuser;
