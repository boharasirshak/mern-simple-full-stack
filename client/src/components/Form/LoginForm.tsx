import { useAuth } from "@src/context/AuthContext";
import { logInschema } from "@src/schemas";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Error from "./Error";
import SubmitButton from "./SubmitButton";
import TextInput from "./TextInput";

import { LoginDataType } from "@src/types/User";

const defaultUserDetails: LoginDataType = {
  email: "",
  password: "",
};

function LoginForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [err, seterr] = useState("");
  const {
    values,
    handleSubmit,
    handleChange,
    handleBlur,
    errors,
    touched,
    isValid,
    isSubmitting,
    setSubmitting,
    resetForm,
  } = useFormik({
    initialValues: defaultUserDetails,
    validationSchema: logInschema,
    validateOnMount: true,

    onSubmit: async (value) => {
      try {
        const err = await login(value);
        if (err) {
          seterr(err);
        } else {
          navigate("/");
        }
        setSubmitting(false);
        resetForm();
      } catch (error) {
        console.error(error);
      }
    },
  });

  return (
    <form
      className="flex flex-col shrink w-full items-center space-y-7 px-4 sm:p-0"
      onSubmit={handleSubmit}
    >
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
          text="Sign in"
          isSubmitting={isSubmitting}
        />
      </div>
    </form>
  );
}

export default LoginForm;
