import { User } from '@/type/api'

export default function getSignedInUser(): User | undefined {
  const user = localStorage.getItem('user')
  if (user) {
    const userData = JSON.parse(user) as User
    return userData
  }

  return
}
