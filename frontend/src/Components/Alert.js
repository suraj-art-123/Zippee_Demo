import Swal from "sweetalert2";

const Alert = (props) => {
  Swal.fire({
    title: props.msg,
    icon: props.icon,
    position: "top",
    timer: 3000,
    timerProgressBar: true,
    showConfirmButton: false,
  });
};

export default Alert;
