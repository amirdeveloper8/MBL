import axios, { Axios } from "axios";
import { useContext, useState } from "react";
import { Form } from "react-bootstrap";
import AuthContext from "../../store/auth-context";
import Image from "next/image";

const BusinessImage = () => {
  const [imagedata, setImagedata] = useState();

  const handleChange = (file) => {
    setImagedata(file[0]);
  };

  const authCtx = useContext(AuthContext);

  const login_token = authCtx.token;

  const imageSource = authCtx.imageSrc;

  const headers = {
    Authorization: `Bearer ${login_token}`,
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const fData = new FormData();

    fData.append("image", imagedata);

    axios({
      method: "POST",
      url: "http://192.168.7.19/nmbl/public/auth/user/update",
      headers: headers,
      data: fData,
    })
      .then((res) => {
        console.log("res", res.data);
        if (res.data.msg === "success update") {
          authCtx.addImage(res.data.user.photo_url);
        }
      })
      .catch((err) => {
        console.log("Error", err);
      });
  };
  return (
    <section>
      <div>
        {/* <Image
          src="http://192.168.7.19/nmbl/public/storage/app/photos/2050041378.jpg"
          width={100}
          height={100}
        /> */}
        <img src={imageSource} />
      </div>
      <Form onSubmit={submitHandler}>
        <Form.Group className="mb-3">
          <Form.Label>Small file input example</Form.Label>
          <Form.Control
            name="image"
            id="image"
            type="file"
            onChange={(e) => handleChange(e.target.files)}
            size="sm"
          />
        </Form.Group>
        <button type="submit">Upload</button>
      </Form>
    </section>
  );
};

export default BusinessImage;
