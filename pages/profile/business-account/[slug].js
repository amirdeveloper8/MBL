import BusinessAddress from "../../../components/profile/bussines/BusinessAddress";

const StaffInner = (props) => {
  return <BusinessAddress />;
};

export const getServerSideProps = async (context) => {
  const { params } = context;

  const businessId = params.slug;

  return {
    props: {
      // data: data,
      businessId,
    },
  };
};

export default StaffInner;
