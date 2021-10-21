import UpdatePassword from "../../../components/auth/resetPassword/updatePassword";

const UpdatePass = (props) => {
  const { user } = props;

  return <UpdatePassword userId={user[0]} userToken={user[1]} />;
};

export const getServerSideProps = async (context) => {
  const { params } = context;

  const userId = params.slug;

  return {
    props: {
      // data: data,
      user: userId,
    },
  };
};

export default UpdatePass;
