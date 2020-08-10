import axios from "axios";
function redirectAuth() {
  const API_DOMAIN = process.env.REACT_APP_API_DOMAIN;
  axios.get(API_DOMAIN + "/authorize").then((res) => {
    console.log(res.data);
    window.location = res.data;
  });
}

export default redirectAuth;
