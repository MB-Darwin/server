import moment from "moment";

const formatDate = (createdAt) => {
  return moment(createdAt).format("DD MMMM YYYY");
};

export default formatDate;
