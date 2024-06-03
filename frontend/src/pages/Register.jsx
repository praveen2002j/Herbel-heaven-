import React, { useState } from 'react';
import axios from 'axios';
import { Card, Input, Checkbox, Button, Typography } from '@material-tailwind/react';
import { Link, useNavigate } from 'react-router-dom';
import { SidebarWithBurgerMenu } from '../components/navBar';

export default function Register() {
  const [previewUrl, setPreviewUrl] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobileNumber: '',
    gender: '',
    age: '',
    address: '',
    agreeTerms: false,
    image: null // New state for image
  });
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    setPreviewUrl(URL.createObjectURL(file));
  };
   
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError('Please enter a valid email address');
      } else {
        setError('');
      }
    }

    if (name === 'mobileNumber') {
      const regex = /^\d*$/;
      if (!regex.test(value)) {
        setError('Mobile number should contain only digits');
      } else if (value.length > 10) {
        setError('Mobile number should be exactly 10 digits');
      } else {
        setError('');
      }
    }

    if (name === 'name') {
      const nameRegex = /^[A-Za-z]+$/;
      if (!nameRegex.test(value)) {
        setError('Name should contain only letters');
      } else {
        setError('');
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (error) {
      window.alert('Please fix the errors before submitting');
      return;
    }

    if (!formData.name || !formData.email || !formData.password || !formData.mobileNumber || !formData.address || !formData.gender || !formData.age || !formData.agreeTerms) {
      setError('Please fill in all fields');
      return;
    }

    if (formData.age === 0) {
      setError('Give a valid age');
      return;
    }

    try {
      const uplimg = new FormData();
      uplimg.append('image', formData.image);
  
      // Upload the image
      const imgResponse = await axios.post('http://localhost:8070/api/customer/uploadimage', uplimg);
      const imageUrl = imgResponse.data.downloadURL;
  

      formData.image = imageUrl;

      const response = await axios.post('http://localhost:8070/api/customer/register', formData);

      
      console.log('Registration successful:', response.data);
      window.alert('Registration success');
      window.alert('Login to access');
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error.response.data);
      window.alert('Registration failed');
    }
  };

  return (
    <>
      <SidebarWithBurgerMenu />
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Card color="transparent" shadow={false} className="bg-green-100 max-w-xl w-full p-8">
          <Typography variant="h4" color="blueGray" className="text-center mb-4">
            Sign Up
          </Typography>
          <Typography color="gray" className="mb-8 text-center">
            Nice to meet you! Enter your details to register.
          </Typography>
          {error && <Typography variant="body" color="red" className="mb-4">{error}</Typography>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center space-x-4">
              <Typography variant="body" color="blueGray" className="font-bold">
                Your Name:
              </Typography>
              <Input
                size="lg"
                placeholder="Enter your name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 flex-grow"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Typography variant="body" color="blueGray" className="font-bold">
                Your Email:
              </Typography>
              <Input
                size="lg"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 flex-grow"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Typography variant="body" color="blueGray" className="font-bold">
                Password:
              </Typography>
              <Input
                size="lg"
                type="password"
                placeholder="Enter your password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 flex-grow"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Typography variant="body" color="blueGray" className="font-bold">
                Mobile Number:
              </Typography>
              <Input
                size="lg"
                placeholder="Enter your mobile number"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 flex-grow"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Typography variant="body" color="blueGray" className="font-bold">
                Gender:
              </Typography>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="male"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                />
                <label htmlFor="male" className="ml-2 mr-4">Male</label>
                <input
                  type="radio"
                  id="female"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                />
                <label htmlFor="female" className="mr-4">Female</label>
                <input
                  type="radio"
                  id="other"
                  name="gender"
                  value="other"
                  checked={formData.gender === "other"}
                  onChange={handleChange}
                />
                <label htmlFor="other">Other</label>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Typography variant="body" color="blueGray" className="font-bold">
                Age:
              </Typography>
              <Input
                size="lg"
                placeholder="Enter your age"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 flex-grow"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Typography variant="body" color="blueGray" className="font-bold">
                Address:
              </Typography>
              <Input
                size="lg"
                placeholder="Enter your address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900 flex-grow"
              />
            </div>
            <div className="flex items-center space-x-4">
              <Typography variant="body" color="blueGray" className="font-bold">
                Image:
              </Typography>
              <Input
                id="image"
                type="file"
                accept=".jpg,.png,.jpeg"
                placeholder="Add image"
                onChange={handleImageChange}
                className="bg-white !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{ className: 'before:content-none after:content-none' }}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Product Preview"
                  style={{
                    marginLeft: '1rem',
                    width: '100px',
                    height: 'auto',
                  }}
                />
              )}
            </div>
            <Checkbox
              label={
                <Typography
                  variant="small"
                  color="gray"
                  className="flex items-center font-normal"
                >
                  I agree to the
                  <Link
                    to="#"
                    className="font-medium transition-colors hover:text-gray-900"
                  >
                    &nbsp;Terms and Conditions
                  </Link>
                </Typography>
              }
              containerProps={{ className: '-ml-2.5 mb-4' }}
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleCheckboxChange}
            />
            <Button fullWidth type="submit">
              Sign up
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
              Already have an account?{' '}
              <Link to="/login" className="font-medium text-gray-900">
                Sign In
              </Link>
            </Typography>
          </form>
        </Card>
      </div>
    </>
  );
}
