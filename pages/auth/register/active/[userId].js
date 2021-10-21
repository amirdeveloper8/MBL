import Button from "../../../../components/ui/Button";
import { ConnectToDB } from "../../../../lib/connect-to-db";
import Link from "next/link";

const UserId = (props) => {
  const { data } = props;
  return (
    <div className="center">
      <h2>{data.user}</h2>
      <p>{data.msg}</p>
      <div className="center">
        <Button>
          <Link href="/auth/login">Login</Link>
        </Button>
      </div>
    </div>
  );
};

export const getServerSideProps = async (context) => {
  const { params } = context;

  const userId = params.userId;

  const connectDB = ConnectToDB("api/active/account/status");

  const res = await fetch(connectDB, {
    method: "POST",
    body: JSON.stringify({ email: userId }),
    headers: {
      "Content-type": "application/json",
    },
  });

  const data = await res.json();

  console.log(data);

  return {
    props: {
      data: data,
    },
  };
};

export default UserId;
