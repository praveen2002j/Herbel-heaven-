import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { DefaultSidebar } from '../components/Manager-Sidebar';
import AdminNavbar from '../components/AdminNavbar';
import {
    Button,
  Card,
  CardBody,
  CardFooter,
  IconButton,
  Input,
  Typography,
} from '@material-tailwind/react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

export function getStatusColor(status) {
  switch (status) {
    case 'Paid':
    case 'Delivered':
      return 'text-green-900 bg-green-500/20';
    case 'Canceled':
    case 'Unpaid':
      return 'text-red-900 bg-red-500/20';
    case 'Preparing':
      return 'text-blue-900 bg-blue-500/20';
    default:
      return '';
  }
}

export default function Order() {
  const [eligibleCustomers, setEligibleCustomers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(4); // Number of customers per page

  useEffect(() => {
    retrieveEligibleCustomers();
  }, []);

  const retrieveEligibleCustomers = () => {
    axios.get('http://localhost:8070/api/orders/orders').then((res) => {
      if (res.data.success) {
        // Filter orders based on eligibility criteria
        const filteredOrders = res.data.existingOrders.filter(order => order.total > 700 && order.paymentStatus === 'Paid');

        // Extract eligible customers' names and total amounts
        const eligibleCustomersData = filteredOrders.map(order => ({
          name: order.customer||order.user,
          total: order.total,
          points: Math.floor(order.total / 10), // Calculate points (1 point for every 10 Rs)
        }));

        setEligibleCustomers(eligibleCustomersData);
      }
    });
  };

  // Change page
  const indexOfLastItem = currentPage * customersPerPage;
  const indexOfFirstItem = indexOfLastItem - customersPerPage;
  const currentCustomers = eligibleCustomers.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(eligibleCustomers.length / customersPerPage); i++) {
    pageNumbers.push(i);
  }
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => setCurrentPage(currentPage + 1);
  const prevPage = () => setCurrentPage(currentPage - 1);

  return (
    <div
      className="flex flex-col h-screen overflow-hidden overflow-x-hidden"
      style={{ backgroundColor: '#02353c' }}
    >
      <div className="flex flex-1 overflow-auto">
        {/* Sidebar */}
        <div className="sidebar w-68 bg-custom-color text-white hidden">
          <DefaultSidebar />
        </div>
        <div className="flex flex-col flex-1">
          {/* Navbar */}
          <AdminNavbar />

          {/* Card */}
          <Card className="flex flex-col flex-1 ml-2">
            <Typography className="h2 text-3xl font-bold mt-4 mb-2 mr-2 ml-2">
              Loyalty members
            </Typography>

            {/* Search input */}
            <div className="flex items-center ml-2 mb-4">
              <Input
                type="text"
                placeholder="Search by customer name"
                onChange={() => {}}
                className="mr-2"
                label="Search"
              />
            </div>

            {/* Customers list */}
            <CardBody>
              <div>
                <table className="w-full text-left min-w-max">
                  <thead>
                    <tr>
                      <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                        <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                          #
                        </p>
                      </th>
                      <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                        <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                          Customer Name
                        </p>
                      </th>
                      <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                        <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                          Total Amount (Rs)
                        </p>
                      </th>
                      <th className="p-4 border-y border-blue-gray-100 bg-blue-gray-50/50">
                        <p className="block font-sans text-sm antialiased font-normal leading-none text-blue-gray-900 opacity-70">
                          Loyalty Points
                        </p>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentCustomers.map((customer, index) => (
                      <tr key={index}>
                        <td className="p-4 border-b border-blue-gray-50">
                          <div className="flex items-center gap-3">
                            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                              {index + 1}
                            </p>
                          </div>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {customer.name}
                          </p>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {customer.total}
                          </p>
                        </td>
                        <td className="p-4 border-b border-blue-gray-50">
                          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                            {customer.points}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardBody>
            {/* Pagination */}
            <CardFooter className="flex justify-center items-center mb-2">
              <Button
                variant="outlined"
                size="sm"
                onClick={prevPage}
                disabled={currentPage === 1}
                className="mr-2"
              >
                Previous
              </Button>
              <div className="flex gap-2">
                {pageNumbers.map((number) => (
                  <IconButton
                    key={number}
                    variant={number === currentPage ? 'filled' : 'outlined'}
                    size="sm"
                    onClick={() => paginate(number)}
                    className={`${
                      number === currentPage
                        ? 'bg-blue-500 text-white'
                        : 'text-blue-500'
                    }`}
                  >
                    {number}
                  </IconButton>
                ))}
              </div>
              <Button
                variant="outlined"
                size="sm"
                onClick={nextPage}
                disabled={indexOfLastItem >= eligibleCustomers.length}
                className="ml-2"
              >
                Next
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
