import { SignupDataType } from "@src/types/User";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { signUpschema } from "../../schemas";
import Error from "./Error";
import SubmitButton from "./SubmitButton";
import TextInput from "./TextInput";

const defaultUserDetails: SignupDataType = {
  name: "",
  email: "",
  password: "",
};

function Signupform() {
  const [err, setErr] = useState<string>("");
  const { signup } = useAuth();
  const navigate = useNavigate();

  const {
    values,
    touched,
    handleSubmit,
    handleChange,
    errors,
    handleBlur,
    isValid,
    isSubmitting,
    setSubmitting,
  } = useFormik({
    initialValues: defaultUserDetails,
    validationSchema: signUpschema,
    validateOnMount: true,
    onSubmit: async (values) => {
      const err = await signup(values);
      if (err) {
        setErr(err);
      } else {
        setSubmitting(false);
        navigate("/");
      }
    },
  });

  return (
    <form
      className="flex flex-col shrink w-full items-center space-y-7 px-4 sm:p-0"
      onSubmit={handleSubmit}
      autoComplete="off"
      noValidate
    >
      <TextInput
        type="text"
        placeholder="Profile Name"
        id="name"
        name="name"
        label="Profile Name"
        value={values.name ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.name}
        touched={touched.name}
      />

      <TextInput
        type="email"
        placeholder="Your Email"
        id="email"
        name="email"
        label="Email"
        value={values.email ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.email}
        touched={touched.email}
      />

      <TextInput
        type="password"
        placeholder="Password"
        id="password"
        name="password"
        label="Password"
        value={values.password ?? ""}
        onChange={handleChange}
        onBlur={handleBlur}
        error={errors.password}
        touched={touched.password}
      />
      <div className="flex justify-start w-full sm:w-3/4 text-xl">
        {err ? <Error err={err} /> : null}
      </div>
      <div className="w-full sm:w-1/2">
        <SubmitButton
          disabled={!isValid}
          text="Sign up"
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
}

export default Signupform;
