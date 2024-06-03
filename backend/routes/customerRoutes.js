const express = require('express');
const fileUpload = require('../middleware/cusProfileMiddleware');
const {
  signup,
  dashboard,
  loginUser,
  updateProfile,
  deleteProfile,
  getAllCustomers,
 
} = require('../controllers/customerController');
const { protect } = require('../middleware/authMiddleware');
const route = express.Router();

//routes express
//@private
//Get Function


route.post('/', loginUser);
route.post('/register', signup);
route.get('/profile', protect, dashboard);
route.put('/profile', protect, updateProfile);
//route.delete('/', protect,   deleteProfile); 

//route.get('/all',protect,admin,getAllCustomers); 
//route.get('/all',protect, getAllCustomers); 
route.get('/all', getAllCustomers); 


route.post('/uploadimage', fileUpload);

//route.delete('/delete', protect, deleteProfile); 
route.delete('/delete', deleteProfile); 
module.exports = route;
