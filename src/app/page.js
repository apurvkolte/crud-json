'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { MdDelete, MdModeEditOutline } from "react-icons/md";
import { CiSearch } from "react-icons/ci";
import { useForm } from 'react-hook-form';
const index = () => {
  const [originalData, setOriginalData] = useState([]);
  const [data, setData] = useState([]);


  const [editIndex, setEditIndex] = useState(null);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState("asc");
  const [recordsToShow, setRecordsToShow] = useState(5);

  const { register, handleSubmit, setValue, formState: { errors, isSubmitSuccessful }, reset } = useForm();


  useEffect(() => {
    getDeta()
  }, [])

  const getDeta = async () => {
    const res = await fetch('/api/load', {
      methos: "GET"
    })

    const result = await res.json();
    if (Array.isArray(result)) {
      setOriginalData(result);
      setData(result);
    }
  }

  const handleDelete = async (indexToDelete) => {
    const updatedOriginalData = originalData.filter((_, i) => i !== indexToDelete);
    setOriginalData(updatedOriginalData);
    setData(updatedOriginalData);

    await fetch('/api/saveall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedOriginalData),
    });
  };


  const onSubmit = async (formData) => {
    const updatedItem = {
      name: formData.name,
      email: formData.email,
      mobile: formData.mobile,
      message: formData.message,
    };

    const updatedOriginalData = [...originalData];
    updatedOriginalData[editIndex] = updatedItem;

    setOriginalData(updatedOriginalData);
    setData(updatedOriginalData);
    setEditIndex(null);

    await fetch('/api/saveall', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedOriginalData),
    });

    const modalEl = document.getElementById('exampleModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
  };


  const handleSearch = () => {
    const lowerSearch = search.toLowerCase();
    const filtered = originalData.filter(item =>
      item.name.toLowerCase().includes(lowerSearch) ||
      item.email.toLowerCase().includes(lowerSearch) ||
      item.mobile.toLowerCase().includes(lowerSearch) ||
      item.message.toLowerCase().includes(lowerSearch)
    );
    setData(filtered);
  };



  const sortedData = [...data].sort((a, b) => {
    const nameA = typeof a.name === "string" ? a.name : "";
    const nameB = typeof b.name === "string" ? b.name : "";

    if (sortOrder === "asc") {
      return nameA.localeCompare(nameB);
    } else {
      return nameB.localeCompare(nameA);
    }
  });


  const visibleData = sortedData.slice(0, recordsToShow);





  return (
    <div className="py-5 p-5">
      <div className="col-md-4 mx-auto p-4 d-flex flex-column justify-content-center align-items-center">


        <Link href='/enquiry' className='btn btn-primary mb-4'>Add a Message</Link>
        <div className='d-flex gap-2'>
          <input type='text' value={search} onChange={(e) => setSearch(e.target.value)} placeholder='Search Message' className='form-control' />
          <button className='btn btn-info text-white' onClick={handleSearch} ><CiSearch /></button>
        </div>

        <div className="d-flex gap-3 mb-3 mt-4">
          <button
            className="btn btn-sm btn-outline-secondary btn-secondary text-white"
            onClick={() => setSortOrder("asc")}
          >
            Sort Asc
          </button>
          <button
            className="btn btn-sm btn-outline-secondary btn-secondary text-white"
            onClick={() => setSortOrder("desc")}
          >
            Sort Desc
          </button>

          <select
            className="form-select w-auto"
            value={recordsToShow}
            onChange={(e) => setRecordsToShow(Number(e.target.value))}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={data.length}>All</option>
          </select>
        </div>

        <table className="table table-bordered table-striped mt-4 mb-4">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Contact</th>
              <th scope="col">Message</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {visibleData.length > 0 &&
              visibleData.map((item, i) => (
                <tr key={i}>
                  <td>{item.name}</td>
                  <td>{item.email}</td>
                  <td>{item.mobile}</td>
                  <td>{item.message}</td>
                  <td className='d-flex gap-2'>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(i)}
                    >
                      <MdDelete />
                    </button>

                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      onClick={() => {
                        const originalIndex = originalData.findIndex(
                          d => d.email === item.email && d.name === item.name
                        );
                        setEditIndex(originalIndex);
                        setValue("name", item.name);
                        setValue("email", item.email);
                        setValue("mobile", item.mobile);
                        setValue("message", item.message);
                      }}
                    >
                      <MdModeEditOutline />
                    </button>

                  </td>

                </tr>
              ))
            }

          </tbody>
        </table>

        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <h1 class="modal-title fs-5" id="exampleModalLabel">Update Message</h1>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body">
                <div className=" mx-auto  p-4 d-flex flex-column justify-content-center align-items-center">
                  {isSubmitSuccessful && (
                    <div className="alert alert-success w-100">
                      Message sent successfully!
                    </div>
                  )}

                  <form onSubmit={handleSubmit(onSubmit)} className="w-100">
                    <div className="form-group mb-3">
                      <label className='mb-2'>Name</label>
                      <input
                        type="text"
                        className={`form-control mb-1 ${errors.name ? 'is-invalid' : ''}`}
                        placeholder="Enter the name"
                        {...register('name', { required: 'Name is required' })}
                      />
                      {errors.name && <small className="text-danger">{errors.name.message}</small>}
                    </div>

                    <div className="form-group mb-3">
                      <label className='mb-2'>Email</label>
                      <input
                        type="email"
                        className={`form-control mb-1 ${errors.email ? 'is-invalid' : ''}`}
                        placeholder="Enter the email"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: 'Invalid email format',
                          },
                        })}
                      />
                      {errors.email && <small className="text-danger">{errors.email.message}</small>}
                    </div>

                    <div className="form-group mb-3">
                      <label className='mb-2'>Mobile</label>
                      <input
                        type="text"
                        className={`form-control mb-1 ${errors.mobile ? 'is-invalid' : ''}`}
                        placeholder="Contact Number"
                        {...register('mobile', {
                          required: 'Mobile number is required',
                          pattern: {
                            value: /^[0-9]{10,15}$/,
                            message: 'Mobile must be 10 to 15 digits',
                          },
                        })}
                      />
                      {errors.mobile && <small className="text-danger">{errors.mobile.message}</small>}
                    </div>

                    <div className="form-group mb-4">
                      <label className='mb-2'>Message</label>
                      <textarea
                        className={`form-control mb-1 ${errors.message ? 'is-invalid' : ''}`}
                        rows="4"
                        placeholder="Write your message"
                        {...register('message', {
                          required: 'Message is required',
                          minLength: {
                            value: 10,
                            message: 'Message must be at least 10 characters',
                          },
                        })}
                      ></textarea>
                      {errors.message && <small className="text-danger">{errors.message.message}</small>}
                    </div>

                    <div className="d-flex justify-content-center align-items-center gap-2">
                      <button type="submit" className="btn btn-md btn-primary">Update</button>
                    </div>
                  </form>
                </div>
              </div>
              <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>

              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default index