import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { loginUser } from '../redux/authSlice';

const LoginController = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [formValues, setFormValues] = useState({
    username: '',
    password: '',
  });

  const handleInputChange = (field, value) => {
    setFormValues((prevValues) => ({ ...prevValues, [field]: value }));
  };

  const handleSignIn = () => {
    if (!formValues.username || !formValues.password) {
      alert('Username and Password are required.');
      return;
    }

    // Afficher les valeurs saisies dans la console
    console.log('Username:', formValues.username);
    console.log('Password:', formValues.password);

    dispatch(loginUser(formValues));
  };

  return {
    formValues,
    handleInputChange,
    handleSignIn,
    loading,
    error,
  };
};

export default LoginController;
