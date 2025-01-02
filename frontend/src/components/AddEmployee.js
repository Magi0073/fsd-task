import React from 'react';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import './AddEmployee.css'; // Ensure to include the CSS for styling

const AddEmployee = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm();

  // Watch input values for dynamic validation
  const watchFields = watch();

  // Submit handler
  const onSubmit = async (data) => {
    try {
      const response = await axios.post('https://fsd-task-yo3a.onrender.com/api/employees', data);
      alert(response.data.message); // Success message
      reset(); // Reset form after successful submission
    } catch (error) {
      alert(error.response?.data?.message || 'Submission failed'); // Error message
    }
  };

  return (
    <div className="form-container">
      <h2>Add Employee</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Name */}
        <div>
          <label>Name:</label>
          <input
            {...register('name', {
              required: 'Name is required',
              pattern: {
                value: /^[A-Za-z\s]+$/,
                message: 'Name can only contain alphabets and spaces',
              },
            })}
            placeholder="Enter full name"
          />
          {errors.name && <p className="error">{errors.name.message}</p>}
  </div>
        {/* Employee ID */}
        <div>
          <label>Employee ID:</label>
          <input
            {...register('employeeId', {
              required: 'Employee ID is required',
              maxLength: { value: 10, message: 'Max 10 characters allowed' },
            })}
            placeholder="Enter Employee ID"
          />
          {errors.employeeId && <p className="error">{errors.employeeId.message}</p>}
        </div>

        {/* Email */}
        <div>
          <label>Email:</label>
          <input
            type="email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: 'Invalid email format',
              },
            })}
            placeholder="Enter email"
          />
          {errors.email && <p className="error">{errors.email.message}</p>}
        </div>

        {/* Phone Number */}
        <div>
          <label>Phone Number:</label>
          <input
            {...register('phoneNumber', {
              required: 'Phone number is required',
              pattern: {
                value: /^\d{10}$/,
                message: 'Must be a valid 10-digit number',
              },
            })}
            placeholder="Enter phone number"
          />
          {errors.phoneNumber && <p className="error">{errors.phoneNumber.message}</p>}
        </div>

        {/* Department */}
        <div>
          <label>Department:</label>
          <select
            {...register('department', { required: 'Department is required' })}
          >
            <option value="">Select Department</option>
            <option value="HR">HR</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
          </select>
          {errors.department && <p className="error">{errors.department.message}</p>}
        </div>

        {/* Date of Joining */}
        <div>
          <label>Date of Joining:</label>
          <input
            type="date"
            {...register('dateOfJoining', {
              required: 'Date of joining is required',
              validate: (value) =>
                new Date(value) <= new Date() || 'Cannot select a future date',
            })}
          />
          {errors.dateOfJoining && (
            <p className="error">{errors.dateOfJoining.message}</p>
          )}
        </div>

        {/* Role */}
        <div>
          <label>Role:</label>
          <input
            {...register('role', {
              required: 'Role is required',
            })}
            placeholder="Enter role (e.g., Manager, Developer)"
          />
          {errors.role && <p className="error">{errors.role.message}</p>}
        </div>

        {/* Submit and Reset Buttons */}
        <div className="buttons">
          <button type="submit">Submit</button>
          <button type="button" onClick={() => reset()}>
            Reset
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEmployee;
