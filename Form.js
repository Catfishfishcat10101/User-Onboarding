import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import axios from 'axios';

const validationSchema = Yup.object().shape({
  first_name: Yup.string().required('First name is required'),
  last_name: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  terms: Yup.boolean().oneOf([true], 'You must accept the terms of service')
});

const Form = () => {
  const [formState, setFormState] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    terms: false
  });
  const [users, setUsers] = useState([]);

  const formSubmit = (e) => {
    e.preventDefault();
    validationSchema.validate(formState)
      .then(() => {
        axios.post('https://reqres.in/api/users', formState)
          .then(res => {
            setUsers([...users, res.data]);
            console.log(res.data);
          })
          .catch(err => console.log(err.response));
      })
      .catch(errors => {
        console.log(errors);
      });
  };

  const inputChange = (e) => {
    e.persist();
    setFormState({...formState, [e.target.name]: e.target.value});
  };

  const checkboxChange = (e) => {
    setFormState({...formState, terms: e.target.checked});
  };

  useEffect(() => {
    // fetch users data on mount
    axios.get('https://reqres.in/api/users')
      .then(res => {
        setUsers(res.data.data);
      })
      .catch(err => console.log(err.response));
  }, []);

  return (
    <div>
      <form onSubmit={formSubmit}>
        <input 
          type="text" 
          name="first_name" 
          placeholder="First Name" 
          value={formState.first_name} 
          onChange={inputChange} 
        />
        {validationSchema.errors?.first_name && <div>{validationSchema.errors.first_name}</div>}

        <input 
          type="text" 
          name="last_name" 
          placeholder="Last Name" 
          value={formState.last_name} 
          onChange={inputChange} 
        />
        {validationSchema.errors?.last_name && <div>{validationSchema.errors.last_name}</div>}

        <input 
          type="email" 
          name="email" 
          placeholder="Email" 
          value={formState.email} 
          onChange={inputChange} 
        />
        {validationSchema.errors?.email && <div>{validationSchema.errors.email}</div>}

        <input 
          type="password" 
          name="password" 
          placeholder="Password" 
          value={formState.password} 
          onChange={inputChange} 
        />
        {validationSchema.errors?.password && <div>{validationSchema.errors.password}</div>}

        <input 
          type="checkbox" 
          name="terms" 
          checked={formState.terms} 
          onChange={checkboxChange} 
        />
        <label htmlFor="terms">I accept the terms of service</label> 
        {validationSchema.errors?.terms && <div>{validationSchema.errors.terms}</div>}

        <button type="submit">Submit</button>
      </form>
      <pre>{JSON.stringify(users, null, 2)}</pre>
    </div>
  );
};

export default Form;