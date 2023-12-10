export const validateAll = (values,setValidations) => {

  const { name, email,username,password,lastname } = values;
  const validations = {
    name: "",
    email: "",
    username: "",
    lastname: "",
    password: "",
  };
  let isValid = true;
  
 



  if (!username) {
    validations.username = "Username is required";
    isValid = false;
  }

  if ((username && username.length < 3) || username.length > 15) {
    validations.username = "Username must contain between 4 and 15 characters";
    isValid = false;
  }

  if (!name) {
    validations.name = "Firstname is required";
    isValid = false;
  }
  if (name && name.length < 3 || name.length > 15) {
    validations.name = "Firstname must contain between 4 and 15 characters";
    isValid = false;
  }

  
  if (!lastname) {
    validations.lastname = "Lastname is required";
    isValid = false;
  }
  
  if (lastname && lastname.length < 3 || lastname.length > 15) {
    validations.lastname = "Lastname must contain between 4 and 15 characters";
    isValid = false;
  }

 



  if (!email) {
    validations.email = "Email is required";
    isValid = false;
  }

  if (email && !/\S+@\S+\.\S+/.test(email)) {
    validations.email = "Email format must be as example@mail.com";
    isValid = false;
  }



  if (!password) {
    validations.password = "password is required";
    isValid = false;
  }

  if (password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(password)) {
    validations.password =  "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter,  one digit";
    isValid = false;
  }





  if (!isValid) {
    setValidations(validations);
  }

  return isValid;
};

export const validateOne = (e,values,validations, setValidations) => {
  e.preventDefault();
  const { name } = e.target;
 
  const value = values[name]?.trim();

 
   
  let message = "";
 let className="";
  if (!value) {
    message = `${name} is required`;
    className = "inputerror";
  }

  if (value && name === "username" && (value.length < 3 || value.length > 15)) {
    message = "Username must contain between 4 and 15 characters";
    className = "inputerror";
  }

  if (value && name === "lastname" && (value.length < 3 || value.length > 15)) {
    message = "Lastname must contain between 4 and 15 characters";
    className = "inputerror";
  }
  
  if (value && name === "name" && (value.length < 3 || value.length > 15)) {
    message = "Firstname must contain between 4 and 15 characters";
    className = "inputerror";
  }
 
  if (value && name === "email" && !/\S+@\S+\.\S+/.test(value)) {
    message = "Email format must be as example@mail.com";
    className = "inputerror";
  }
  
  if (value && name === "password" && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(value)) {
    message =  "Password must contain at least 8 characters, including at least one uppercase letter, one lowercase letter,  one digit";
    className = "inputerror";
  }

  setValidations({ ...validations, [name]: message  });
};
