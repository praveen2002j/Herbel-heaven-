import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Input } from '@material-tailwind/react';
import { Card, Typography, Button } from '@material-tailwind/react';
import { Link } from 'react-router-dom';

import { Footer } from '../components/Footer';
import AdminNavbar from '../components/AdminNavbar';
import { DefaultSidebar } from '../components/Manager-Sidebar';

const ReorderItems = () => {
    const [open, setOpen] = React.useState(0);
  
    const [items, setItems] = useState([]);
    const [searchItem, setSearchItem] = useState('');
  
    const toggleSidebar = () => {
      setOpen(!open);
    };
  
    useEffect(() => {
      axios
        .get('http://localhost:8070/inventory/viewReorderItems')
        .then((result) => setItems(result.data))
        .catch((err) => console.log(err));
    }, []);
  
    const handleDelete = (id) => {
      const confirmDelete = window.confirm(
        'Are you sure you want to delete this item?'
      );
      if (confirmDelete) {
        axios
          .delete(`http://localhost:8070/inventory/deleteReorderItem/${id}`)
          .then(() => {
            setItems(items.filter((item) => item._id !== id));
          })
          .catch((err) => console.log(err));
      }
    };
  
    const filteredItems = items.filter((item) => {
        return (
          item.productName.toLowerCase().includes(searchItem.toLowerCase()) ||
          item.shortDescription.toLowerCase().includes(searchItem.toLowerCase()) ||
          item.category.toLowerCase().includes(searchItem.toLowerCase())
        );
      });
  
    return (
      <div
          className="flex flex-col h-screen overflow-hidden overflow-x-hidden"
          style={{ backgroundColor: '#02353c' }}
      >
        <div className="flex flex-1 overflow-scroll">
        <div
          className={`sidebar w-68 bg-custom-color text-white ${
            open ? 'block' : 'hidden'
          }`}
        >
          <DefaultSidebar open={open} handleOpen={setOpen} />
        </div>
        <div className="w-full h-full ">
          <AdminNavbar toggleSidebar={toggleSidebar} />
          <Card className="w-full max-w-10xl p-2">
            <Typography
              variant="h6"
              color="blue-gray"
              className="text-center text-3xl font-bold font-times bg-blue-gray-300 p-2 rounded-md"
            >
              Reorder List
            </Typography>
  
            <table className="w-full  table-auto text-left mx-auto p-10 mt-5">
              <thead>
                <tr>
                  {[
                    'Product No',
                    'Product Name',
                    'category',
                    'Quantity',
                    'Reorder Level',
                    'Delete',
                  ].map((head, index) => (
                    <th
                      key={index}
                      className="border-b border-blue-gray-100 bg-green-300 p-7"
                    >
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-semibold leading-none opacity-70 text-black"
                      >
                        {head}
                      </Typography>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item._id} className="even:bg-green-100 p-4">
                    <td className="p-8">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {item.productNo.toString().replace(/\d/g, '*')}
                      </Typography>
                    </td>
                    <td className="p-2">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {item.productName}
                      </Typography>
                    </td>
                    <td className="p-4">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {item.category}
                      </Typography>
                    </td>
                    <td className="p-8">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {item.quantity}
                      </Typography>
                    </td>
                    <td className="p-8">
                      <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                      >
                        {item.reorderLevel}
                      </Typography>
                    </td>
                   
                    <td className="p-1">
                    
                      <Button
                        color="red"
                        className="mr-1 mt-1"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
          </Card>
          <Footer />
          </div>
          </div>
      </div>
    );
  };
  
  export default ReorderItems;
  