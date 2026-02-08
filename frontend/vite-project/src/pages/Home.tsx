import { useAuth } from "../utils/hooks/useAuth"
import { LoadingSpinner } from "../ui-components";


function Home() {
  const { loading, isAuthenticated , user} = useAuth();
  if(loading) return <LoadingSpinner size={100} />
  return (
    <div>
      {isAuthenticated && <h1 className="text-5xl">welcome {user?.email}</h1>}
    </div>
  )
}

export default Home