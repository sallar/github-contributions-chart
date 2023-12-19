import { useRouter } from "next/router";
import App from ".";

const UserSlug = () => {
  const { query } = useRouter();
  return <App usernameProp={query.username} />;
};

export default UserSlug;
